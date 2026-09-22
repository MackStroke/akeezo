const fs = require('fs');
let c = fs.readFileSync('client/src/pages/admin/AdminHospitalDetailsPage.jsx', 'utf8');

let split = c.split('suggestions={["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu", "Bengali"]}');
if (split.length > 1) {
  let after = split[1];
  after = after.replace('                      </div>\n                    </div>\n                  </div>\n                ))}','                      </div>\n                    </div>\n                  </div>\n                </div>\n              ))}');
  after = after.replace('                      </div>\r\n                    </div>\r\n                  </div>\r\n                ))}','                      </div>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n              ))}');
  c = split[0] + 'suggestions={["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu", "Bengali"]}' + after;
}

// also fix the garbage at the end
c = c.replace(/\s+\}\)\}<\/div>\r?\n\s+\}\)\}<\/div>\r?\n\s+\}\)\}/g, '\n              ))}');
c = c.replace(/\s+\}\)\}<\/div>\r?\n\s+\}\)\}/g, '\n              ))}');

fs.writeFileSync('client/src/pages/admin/AdminHospitalDetailsPage.jsx', c);
console.log('Fixed');
