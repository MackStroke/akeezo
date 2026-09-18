import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const ARRAY_KEYS = ['city', 'specialty', 'accreditation', 'amenity', 'stayLogistic'];
const SCALAR_KEYS = ['experience', 'sort', 'q'];
const PAGINATION_KEYS = ['page', 'limit'];

function paramsToFilters(searchParams) {
  const filters = {};
  for (const key of ARRAY_KEYS) {
    const val = searchParams.get(key);
    filters[key] = val ? val.split(',').filter(Boolean) : [];
  }
  for (const key of SCALAR_KEYS) {
    filters[key] = searchParams.get(key) || '';
  }
  filters.page = parseInt(searchParams.get('page'), 10) || 1;
  filters.limit = parseInt(searchParams.get('limit'), 10) || 20;
  filters.costMin = searchParams.get('costMin') || '';
  filters.costMax = searchParams.get('costMax') || '';
  return filters;
}

function filtersToParams(filters) {
  const params = new URLSearchParams();
  for (const key of ARRAY_KEYS) {
    if (filters[key]?.length) params.set(key, filters[key].join(','));
  }
  for (const key of SCALAR_KEYS) {
    if (filters[key]) params.set(key, filters[key]);
  }
  if (filters.page && filters.page > 1) params.set('page', String(filters.page));
  if (filters.costMin) params.set('costMin', filters.costMin);
  if (filters.costMax) params.set('costMax', filters.costMax);
  return params;
}

const COMPARE_KEY = 'akeezo_compare_hospitals';

function loadCompareSet() {
  try {
    return JSON.parse(sessionStorage.getItem(COMPARE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveCompareSet(set) {
  sessionStorage.setItem(COMPARE_KEY, JSON.stringify(set));
}

export function useHospitalFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hospitals, setHospitals] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [compareSet, setCompareSet] = useState(loadCompareSet);
  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  const filters = paramsToFilters(searchParams);

  const updateFilter = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (Array.isArray(value)) {
          if (value.length) next.set(key, value.join(','));
          else next.delete(key);
        } else if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        // Reset to page 1 on filter change
        next.delete('page');
        return next;
      }, { replace: true });
    },
    [setSearchParams],
  );

  const clearAllFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const setPage = useCallback(
    (page) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (page > 1) next.set('page', String(page));
        else next.delete('page');
        return next;
      }, { replace: true });
    },
    [setSearchParams],
  );

  const setSort = useCallback(
    (sort) => updateFilter('sort', sort),
    [updateFilter],
  );

  // Compare set management
  const toggleCompare = useCallback((hospital) => {
    setCompareSet((prev) => {
      const id = hospital._id || hospital.slug;
      const exists = prev.some(h => (h._id || h.slug) === id);
      let next;
      if (exists) {
        next = prev.filter(h => (h._id || h.slug) !== id);
      } else if (prev.length < 3) {
        next = [...prev, hospital];
      } else {
        return prev;
      }
      saveCompareSet(next);
      return next;
    });
  }, []);

  const removeFromCompare = useCallback((hospital) => {
    setCompareSet((prev) => {
      const id = hospital._id || hospital.slug;
      const next = prev.filter(h => (h._id || h.slug) !== id);
      saveCompareSet(next);
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareSet([]);
    saveCompareSet([]);
  }, []);

  const isInCompareSet = useCallback(
    (hospital) => {
      const id = hospital._id || hospital.slug;
      return compareSet.some(h => (h._id || h.slug) === id);
    },
    [compareSet],
  );

  // Fetch hospitals when filters change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const params = filtersToParams(filters);
        const res = await fetch(`/api/hospitals?${params}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (json.ok) {
          setHospitals(json.data.data || []);
          setPagination({
            total: json.data.total || 0,
            page: json.data.page || 1,
            totalPages: json.data.totalPages || 1,
          });
        } else {
          throw new Error(json.error?.message || 'Failed to fetch hospitals');
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setHospitals([]);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchParams.toString()]);

  // Active filter count (for badge)
  const activeFilterCount = [
    ...ARRAY_KEYS.map(k => filters[k]?.length || 0),
    filters.experience ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return {
    filters,
    hospitals,
    pagination,
    isLoading,
    error,
    activeFilterCount,

    updateFilter,
    clearAllFilters,
    setPage,
    setSort,

    compareSet,
    toggleCompare,
    removeFromCompare,
    clearCompare,
    isInCompareSet,
  };
}
