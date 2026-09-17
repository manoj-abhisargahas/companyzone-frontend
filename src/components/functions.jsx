export function isOnlyPlainObject(value) {
    return value!=null && typeof value==='object' && value.constructor===Object;
}

export function flatten_arr(obj, flattened=[]) {
    console.log(typeof obj);
    if(Array.isArray(obj)) {
        for(const ele of obj) {
            flatten_arr(ele, flattened);
        }
    } else if(isOnlyPlainObject(obj)) {
        for(const [key,value] of Object.entries(obj)) {
            flatten_arr(`${key}: ${value}`, flattened);
        }
    } else {
        flattened.push(obj);
    }
    return flattened;
}

export function manage_api_call_errors(errors, setResMsg, res_error_msg) {
    console.log('error:', errors);
    if(errors.response) {
        // 1. RESPONSE ERROR (Server replied with 400/401/500 status)
        console.log(`⚠ Response Error: ${res_error_msg}`, flatten_arr(errors.response.data));
    } else if(errors.request) {
        // 2. REQUEST ERROR (Network dropped or Server completely dead)
        // error.response is missing (The server didn't send an HTTP code).

        if(!navigator.onLine) {
            // The Core Catch: "Network" vs. "Internet"
            // ----------------------------------------
            // It is very important to understand a major limitation of navigator.onLine: 
            // it only checks if the device is connected to a local network, 
            // not necessarily if the internet is actually working.
            // * If you turn off your Wi-Fi, navigator.onLine will correctly be false.
            // * If you are connected to a router, but that router has a broken internet cable 
            //   (no actual internet service), navigator.onLine might still return true. 
            //   This is because your machine is technically still "on a network."
            setResMsg(['⚠ Please check your network!']);
            console.log('⚠ Request Error: Please check your network!', errors.request);
        }
        else{
            setResMsg(['⚠ Server is not responding, Please try after sometime!']);
            console.log('⚠ Server Error: Server is not responding, Please try after sometime!', errors.request);
        }
    } else {
        // 3. REQUEST SETUP ERROR (Local config bug, bad headers, or client crash)
        // error.request is missing (The browser never successfully created or fired the XHR/Fetch object).
        setResMsg(['⚠ Something went wrong. Please try again!']);
        console.log('⚠ Request Setup Error: Something went wrong. Please try again!', errors.message);
    }
}

export default {isOnlyPlainObject, flatten_arr, manage_api_call_errors};