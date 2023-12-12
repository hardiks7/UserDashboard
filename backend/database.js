const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '2612',
    port: 5433,
});
const { error } = require('console');
const path = require('path')

//country_________

const getcountry = () => {
    return new Promise(function (resolve, reject) {
        pool.query('SELECT * FROM country where isdeleted = false', (err, results) => {
            if (err) {
                reject(err)
            }
            resolve(results.rows);
        })
    })
}

const getcountryById = (countryId) => {
    return new Promise(function (resolve, reject) {
        pool.query('SELECT * FROM country where countryid = $1', [countryId], (err, results) => {
            if (err) {
                reject(err)
            }
            resolve(results.rows[0]);
        })
    })
}

const createcountry = (body) => {
    return new Promise(function (resolve, reject) {
        const { countryname, countrycode, phonecode } = body;
        pool.query('INSERT INTO country (countryname,countrycode,phonecode) VALUES ($1,$2,$3) RETURNING *', [countryname, countrycode, phonecode], (err, results) => {
            if (err) {
                reject(err)
            }
            resolve(results.rows[0]);
        })
    })
}

const updatecountry = (body, countryid) => {
    return new Promise(function (resolve, reject) {
        const { countryname, countrycode, phonecode } = body;
        pool.query('UPDATE country SET countryname = ($2) ,countrycode = ($3) ,phonecode = ($4) WHERE countryid = ($1)', [countryid, countryname, countrycode, phonecode], (err, results) => {
            if (err) {
                reject(err)
            }
            resolve(results.rows[0]);
        })
    })
}

const deletecountry = (countryid) => {
    return new Promise(function (resolve, reject) {
        pool.query('UPDATE country SET isdeleted = true WHERE countryid = $1 ', [countryid], (err, results) => {
            if (err) {
                reject(err)
            }
            resolve(`country Deleted succsecfully${countryid}`);
        })
    })
}


// state___________

const getstate = () => {
    return new Promise(function (resolve, reject) {
        pool.query('SELECT state.stateid, country.countryid, state.statename, country.countryname, state.isdeleted, country.isdeleted FROM state INNER JOIN country ON country.countryid = state.countryid WHERE state.isdeleted = false AND country.isdeleted = false', (err, results) => {
            if (err) {
                reject(err)
            }
            resolve(results.rows);
        })
    })
}

const createstate = (body) => {
    return new Promise(function (resolve, reject) {
        const { selectedCountryId, statename } = body;
        pool.query('INSERT INTO state (countryid,statename) VALUES ($1,$2) RETURNING *', [selectedCountryId, statename], (err, results) => {
            if (err) {
                reject(err)
            }
            resolve(results.rows[0]);
        })
    })
}

const getstateById = (stateId) => {
    return new Promise(function (resolve, reject) {
        pool.query('SELECT * FROM state where stateid = $1', [stateId], (err, results) => {
            if (err) {
                reject(err)
            }
            resolve(results.rows[0]);
        })
    })
}

const deletestate = (stateid) => {
    return new Promise(function (resolve, reject) {
        pool.query('UPDATE state SET isdeleted = true WHERE stateid = $1 ', [stateid], (err, results) => {
            if (err) {
                reject(err)
            }
            resolve(`state Deleted succsecfully${stateid}`);
        })
    })
}

const updatestate = (body, stateid) => {
    return new Promise(function (resolve, reject) {
        const { selectedCountryId, statename } = body;
        pool.query('UPDATE state SET countryid = ($2) ,statename = ($3) WHERE stateid = ($1)', [stateid, selectedCountryId, statename], (err, results) => {
            if (err) {
                reject(err)
            }
            resolve(results.rows[0]);
        })
    })
}


// city___________

const getcity = () => {
    return new Promise(function (resolve, reject) {
        pool.query('select city.cityid, state.stateid, country.countryname, state.statename, city.cityname, state.isdeleted, country.isdeleted, city.isdeleted FROM city left join state ON state.stateid = city.stateid LEFT JOIN country ON country.countryid = city.countryid WHERE city.isdeleted = false AND state.isdeleted = false AND country.isdeleted = false', (err, results) => {
            if (err) {
                reject(err)
            }
            resolve(results.rows);
        })
    })
}

const getcityById = (cityId) => {
    return new Promise(function (resolve, reject) {
        pool.query('SELECT * FROM city where cityid = $1', [cityId], (err, results) => {
            if (err) {
                reject(err)
            }
            resolve(results.rows[0]);
        })
    })
}

const createcity = (body) => {
    return new Promise(function (resolve, reject) {
        const { selectedCountryId, selectedStateId, cityname } = body;
        pool.query('INSERT INTO city (countryid,stateid,cityname) VALUES ($1,$2,$3) RETURNING *', [selectedCountryId, selectedStateId, cityname], (err, results) => {
            if (err) {
                reject(err)
            }
            resolve(results.rows[0]);
        })
    })
}

const updatecity = (body, cityid) => {
    return new Promise(function (resolve, reject) {
        const { selectedCountryId, selectedStateId, cityname } = body;
        pool.query('UPDATE city SET countryid = ($2) ,stateid = ($3), cityname = ($4) WHERE cityid = ($1)', [cityid, selectedCountryId, selectedStateId, cityname], (err, results) => {
            if (err) {
                reject(err)
            }
            resolve(results.rows[0]);
        })
    })
}

const deletecity = (cityid) => {
    return new Promise(function (resolve, reject) {
        pool.query('UPDATE city SET isdeleted = true WHERE cityid = $1 ', [cityid], (err, results) => {
            if (err) {
                reject(err)
            }
            resolve(`city Deleted succsecfully${cityid}`);
        })
    })
}


//  pagination ____  ____  ____

// Country ..

const CountryPagination = (pageNumber, pageSize, filter, sortOrder) => {
    const offset = (pageNumber - 1) * pageSize;
    const query =
        `SELECT * FROM country
    WHERE isdeleted = false
    AND countryname ILIKE $3
    ORDER BY countryname ${sortOrder === 'asc' ? 'ASC' : 'DESC'}
    LIMIT $2 OFFSET $1
    `;

    const countryQuery =
        `SELECT COUNT(*) AS total
    FROM country
    WHERE isdeleted = false AND countryname ILIKE $1
    `;
    return new Promise(function (resolve, reject) {
        pool.query(query, [offset, pageSize, `%${filter}%`], (error, results) => {
            if (error) {
                reject(error);
            }
            pool.query(countryQuery, [`%${filter}%`], (countError, countResults) => {
                if (countError) {
                    reject(countError);
                }

                const totalCount = countResults.rows[0].total;
                const data = results.rows;

                resolve({ data, total: totalCount });
            })
        })
    })
}

// State ..

const StatePagination = (pageNumber, pageSize, filter, sortOrder) => {
    const offset = (pageNumber - 1) * pageSize;
    const query =
        `SELECT state.stateid, country.countryid, state.statename, country.countryname, 
    state.isdeleted, country.isdeleted FROM state INNER JOIN country ON 
    country.countryid = state.countryid WHERE state.isdeleted = false AND country.isdeleted = false
    AND (statename ILIKE $3 OR countryname ILIKE $3 )
    ORDER BY statename ${sortOrder === 'asc' ? 'ASC' : 'DESC'}
    LIMIT $2 OFFSET $1`;

    // const countryQuery =
    //     `SELECT COUNT(*) AS total
    //     FROM state
    //     WHERE isdeleted = false AND statename ILIKE $1
    //     `;

    const countQuery =
        `SELECT COUNT(*) AS total
        FROM state
        INNER JOIN country ON country.countryid = state.countryid
        WHERE state.isdeleted = false AND country.isdeleted = false 
        AND (state.statename ILIKE $1 OR country.countryname ILIKE $1)
        `;
    return new Promise(function (resolve, reject) {
        pool.query(query, [offset, pageSize, `%${filter}%`], (error, results) => {
            if (error) {
                reject(error);
            }
            pool.query(countQuery, [`%${filter}%`], (countError, countResults) => {
                if (countError) {
                    reject(countError);
                }

                const totalCount = countResults.rows[0].total;
                const data = results.rows;

                resolve({ data, total: totalCount });
            })
        })
    })
}

// City .. 

const CityPagination = (pageNumber, pageSize, filter, sortOrder) => {
    const offset = (pageNumber - 1) * pageSize;
    const query =
        `select city.cityid, country.countryname, state.statename, city.cityname,  
        state.isdeleted, country.isdeleted,city.isdeleted FROM city left join state ON 
        city.stateid = state.stateid left join country ON city.countryid = country.countryid WHERE city.isdeleted = false 
        AND state.isdeleted = false AND country.isdeleted = false
        AND (cityname ILIKE $3 OR statename ILIKE $3 OR countryname ILIKE $3)
        ORDER BY cityname ${sortOrder === 'asc' ? 'ASC' : 'DESC'}
        LIMIT $2 OFFSET $1`;

    const countQuery =
        `SELECT COUNT(*) AS total
        FROM city
        LEFT JOIN country ON country.countryid = city.countryid
        LEFT JOIN state ON state.stateid = city.stateid 
        WHERE city.isdeleted = false AND state.isdeleted = false AND country.isdeleted = false 
        AND (city.cityname ILIKE $1 OR state.statename ILIKE $1 OR country.countryname ILIKE $1)`;
    return new Promise(function (resolve, reject) {
        pool.query(query, [offset, pageSize, `%${filter}%`], (error, results) => {
            if (error) {
                reject(error);
            }
            pool.query(countQuery, [`%${filter}%`], (countError, countResults) => {
                if (countError) {
                    reject(countError);
                }

                const totalCount = countResults.rows[0].total;
                const data = results.rows;

                resolve({ data, total: totalCount });
            })
        })
    })
}

// user-sreen .. 

const CreateToken = (body) => {
    return new Promise(function (resolve, reject) {
        const { username, password } = body;
        pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password], (error, results) => {
            if (error) {
                reject(error)
            }
            else {
                if (results.rows.length === 1) {
                    resolve(results.rows[0]);
                }
                else {
                    resolve(null);
                }
            }
        })
    })
}

// userdata - screen

const getUser = () => {
    return new Promise(function (resolve, reject) {
      pool.query(
        "SELECT * FROM userdata WHERE isdeleted = false",
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results.rows);
        }
      );
    });
  };

const CreateUser = (userid, body, profilepicture, resume) => {
    return new Promise(function (resolve, reject) {
        const {
            firstname,
            lastname,
            email,
            phonenumber,
            selectedCountryId,
            selectedStateId,
            selectedCityId,
            address,
        } = body;
        pool.query(
            "SELECT * FROM userdata WHERE email = $1 OR phonenumber = $2",
            [email, phonenumber],
            (checkError, checkResult) => {
                if (checkError) {
                    reject(checkError);
                } else if (checkResult.rows.length > 0) {
                    const existingUser = checkResult.rows[0];
                    if (existingUser.email === email) {
                        reject("Email already exists");
                    }
                    else {
                        reject("Phone number already exists")
                    }
                } else {
                    pool.query(
                        "INSERT INTO userdata (userid, firstname, lastname, email, phonenumber, profilepicture, resume, countryid, stateid, cityid, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
                        [
                            userid,
                            firstname,
                            lastname,
                            email,
                            phonenumber,
                            profilepicture,
                            resume,
                            selectedCountryId,
                            selectedStateId,
                            selectedCityId,
                            address
                        ],
                        (insertError, insertResult) => {
                            if (insertError) {
                                reject(insertError)
                            } else {
                                resolve(insertResult.rows[0]);
                            }
                        }
                    );
                }
            }
        );
    });
};

const getUserById = (userId) => {
    return new Promise(function (resolve, reject) {
      pool.query(
        "SELECT * FROM userdata where userid = $1",
        [userId],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            if (results.rows.length === 0) {
              reject({ message: "User not found" });
            } else {
              resolve(results.rows[0]);
            }
          }
        }
      );
    });
  };

  const ViewUserById = (userid) => {
    const query = `SELECT u.firstname,u.lastname,u.email,u.phonenumber,u.address,u.profilepicture,
                   u.resume,country.countryname,state.statename,city.cityname FROM userdata as u 
                   JOIN country ON u.countryid = country.countryid 
                   JOIN state ON u.stateid = state.stateid
                   JOIN city ON u.cityid = city.cityid WHERE userid = $1`;
  
    return new Promise(function (resolve, reject) {
      pool.query(query, [userid], (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows[0]);
      });
    });
  };

const deleteUser = (userid) => {
    return new Promise(function (resolve, reject) {
        pool.query(
            "UPDATE userdata SET isdeleted = true WHERE userid = $1",
            [userid],
            (error, results) => {
                if (error) {
                    reject(error);
                }
                resolve(`User deleted successfully ${userid}`);
            }
        );
    });
};

const updateUser = (userId, body, profilepicture, resume) => {
    const query = `UPDATE userdata SET firstname = $2, lastname = $3, email = $4, phonenumber = $5,
       profilepicture = $6,resume = $7, countryid = $8, stateid = $9 , cityid = $10, address = $11 WHERE userid = $1`;
    return new Promise(function (resolve, reject) {
      const {
        firstname,
        lastname,
        email,
        phonenumber,
        selectedCountryId,
        selectedStateId,
        selectedCityId,
        address,
      } = body;
      pool.query(
        query,
        [
          userId,
          firstname,
          lastname,
          email,
          phonenumber,
          profilepicture,
          resume,
          selectedCountryId,
          selectedStateId,
          selectedCityId,
          address,
        ],
        (error, results) => {
          if (error) {
            reject(error);
          }
          resolve("User Updated Successfully");
        }
      );
    });
  };


const UserPagination = (pageNumber, pageSize, filter, sortOrder) => {
    const offset = (pageNumber - 1) * pageSize;
    const query =
        `SELECT * FROM userdata
    WHERE isdeleted = false
    AND (firstname ILIKE $3 OR lastname ILIKE $3 OR email ILIKE $3 OR phonenumber ILIKE $3)
    ORDER BY firstname ${sortOrder === 'asc' ? 'ASC' : 'DESC'}
    LIMIT $2 OFFSET $1
    `;

    const countryQuery =
        `SELECT COUNT(*) AS total
        FROM userdata
        WHERE isdeleted = false AND (firstname ILIKE $1 OR lastname ILIKE $1 OR email ILIKE $1 OR phonenumber ILIKE $1)
        `;
    return new Promise(function (resolve, reject) {
        pool.query(query, [offset, pageSize, `%${filter}%`], (error, results) => {
            if (error) {
                reject(error);
            }
            pool.query(countryQuery, [`%${filter}%`], (countError, countResults) => {
                if (countError) {
                    reject(countError);
                }

                const totalCount = countResults.rows[0].total;
                const data = results.rows;

                resolve({ data, total: totalCount });
            })
        })
    })
}

const DownloadResume = (userId, filename) => {
    return new Promise (function(resolve, reject){
        pool.query(
            "SELECT resume FROM userdata where userid = $1 AND resume = $2",
            [userId, filename],
            (error,results) => {
                if(error){
                    reject(error)
                }else{
                    if(results.rows.length === 0){
                        reject({messge : "User or Resume are Not found"});
                    }else{
                        const resumePath = path.join(
                            __dirname,"upload",
                            userId,"resume",
                            results.rows[0].resume
                        );
                        resolve(resumePath)
                    }
                }

            }
        )
    })
}



module.exports = {
    CreateToken,
    
    updateUser,
    ViewUserById,
    deleteUser,
    getUserById,
    getUser,
    
    getcountry,
    getstate,
    getcity,

    createcountry,
    createstate,
    createcity,
    CreateUser,

    updatecountry,
    getcountryById,
    deletecountry,

    updatestate,
    getstateById,
    deletestate,

    updatecity,
    getcityById,
    deletecity,

    CountryPagination,
    StatePagination,
    CityPagination,
    UserPagination,

    DownloadResume

}