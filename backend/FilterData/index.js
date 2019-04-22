const http = require('http');

exports.handler = async (event, context) => {
    if(typeof(event.data) == "undefined" || event.data.length == 0)
        return new Promise((resolve, reject) => resolve(null));

    let data = event.data;
    return new Promise((resolve, reject) => {
        http.get(process.env.URL, (res) => {
          const { statusCode } = res;
          const contentType = res.headers['content-type'];
          let error;
          if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                              `Status Code: ${statusCode}`);
          } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                              `Expected application/json but received ${contentType}`);
          }
          if (error) {
            reject(error.message);
            res.resume();
            return;
          }
        
          res.setEncoding('utf8');
          let rawData = '';
          res.on('data', (chunk) => { rawData += chunk; });
          res.on('end', () => {
            try {
              const filter = JSON.parse(rawData);
              data = data.filter((d) => filterData(filter, d));
              resolve(data);
            } catch (e) {
              reject(e.message);
            }
          });
        }).on('error', (e) => {
          reject(e.message);
        });
    });
};

const filterData = (filter, data)=>{
  let iFrom =  toUnixTime(data._date);
    let iTo = null;
    if(filter == null) return true;
  let r = filter.filter((v) => {
      return (
        v.host != data._domain ||
        (typeof(v.excludedSince) !== "undefined" && toUnixTime(v.excludedSince) > iFrom) || 
        (typeof(v.excludedTill) !== "undefined"  && toUnixTime(v.excludedTill) < iFrom)
      ) ? false : true;
    })
  return r.length == 0;
}

const toUnixTime = (str) =>Math.round(new Date(str).getTime()/1000);