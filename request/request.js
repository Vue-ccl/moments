export const requestAll = (params) => {
    const baseUrl = "https://www.nico33.icu/index.php/Home/Index";
    return new Promise((resolve,reject) => {
      wx.request({
        ...params,
        url: baseUrl+params.url,
        success: (result) => {
          resolve(result);
        },
        fail: (err) => {
          reject(err);
        }
      })
    })
  }