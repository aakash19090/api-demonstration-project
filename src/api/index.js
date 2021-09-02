import history from '../routes/history'

/**
 * check status of API and if status code is not right than handle the exception
 * @author Yamin
 * @param {*} response
 * @returns {response}
 */

const checkStatus = async (response) => {
    if (response.status >= 400 && response.status < 600) {
        console.warn('API error:', response)
        const responseBody = await response.json().catch(() => {
            return {};
        });
    }
    if (
        response.contentType &&
        response.contentType.indexOf('application/json') !== -1
    ) {
        console.warn(
            `Incorrect contentType; expected: application/json, actual: ${response.contentType}`
        )
    }
    return response
}
/**
 * format api request before it send with headers, token and url
 * @author Yamin
 * @param {*} param
 * @returns
 */
const sendRequest = async ({
    method = 'GET',
    endpoint,
    data,
    queryParam = null,
    headers = {},
    usingAuthToken = true,
    rawBody = false,
}) => {
    
    let url = `${process.env.APIURL}${endpoint}` // change the url with the env value
    const params = {
        method,
        headers,
    }

    // eslint-disable-next-line no-use-before-define
    // const csrf = await getCsrfToken(endpoint)
    // params.headers['CSRF-Token'] = csrf
    if (Object.keys(headers).length === 0) {
        params.headers['Content-Type'] = 'application/json'
    }
    // by defauly usingAuthToken for most of the API call but for some API which doesn't need it will skip it
    if (usingAuthToken) {
        const token = localStorage.getItem('token') !== null ? localStorage.getItem('token') : false
        if (token) {
            params.headers.Authorization = `Bearer ${token}`
        }
    }
    // Set the body for the requests except for GET.
    if (data && method !== 'GET') {
        params.body = rawBody ? data : JSON.stringify(data)
    }
    // If query paramter is there than encode that
    if (queryParam !== null) {
        url += encodeURI(queryParam)
    }
    return fetch(url, params)
}
/**
 * General function for unified call of API with proper response handling
 * @author Yamin
 * @param {*} params
 * @returns {JSON}
 */

const api = async (params) => {
    return new Promise(function (resolve, reject) {
        sendRequest(params).then((resp) => {
            if (resp.status === 401) {
                history.push("/");
            }
            resp.json()

            .catch((error) => {
                console.warn("Response from API wasn't JSON serializable", error)
                reject(false)
            })
            .then((response) => checkStatus(response))
            .then(async (response) => {
                resolve(response)
            })
        })
    })
}


export default api

