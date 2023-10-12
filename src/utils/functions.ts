import bcrypt from "bcrypt";

export function getTime() {
    let date = new Date();
 
    let hours = date.getHours();
    let minutes:any = date.getMinutes();
 
    // Check whether AM or PM
    let newformat = hours >= 12 ? 'PM' : 'AM';
 
    // Find current hour in AM-PM Format
    hours = hours % 12;
 
    // To display "0" as "12"
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
 
    return (hours + ':' + minutes + ' ' + newformat);
}

export function getCurrLecture() {

    const currTime = getTime();

    if (currTime >= "9:00 AM" && currTime <= "9:45 AM") return "1";
    else if (currTime >= "9:46 AM" && currTime <= "10:30 AM") return "2";
    else if (currTime >= "10:31 AM" && currTime <= "11:20 AM") return "3";
    else if (currTime >= "11:21 AM" && currTime <= "12:10 PM") return "4";
    else if (currTime >= "12:11 PM" && currTime <= "1:00 PM") return "5";
    else if (currTime >= "1:01 PM" && currTime <= "1:50 PM") return "6";
    else if (currTime >= "1:51 PM" && currTime <= "2:40 PM") return "7";
    else if (currTime >= "2:40 PM" && currTime <= "3:30 PM") return "8";
    else if (currTime >= "3:31 PM" && currTime <= "4:15 PM") return "9";
    else if (currTime >= "4:16 PM" && currTime <= "5:00 PM") return "10";
    else return "0";
}

export async function hashPassword(password:string) {
    return (await bcrypt.hash(password, 12));
}

export async function checkPassword(password:string, hash:string) {
    return (await bcrypt.compare(password, hash));
}

export function lecEnd() {


    const obj = {
        "0" : "00:00 AM",
        "1": "9:45 AM",
        "2": "10:30 AM",
        "3": "11:20 AM",
        "4": "12:10 PM",
        "5": "1:00 PM",
        "6": "1:50 PM",
        "7": "2:40 PM",
        "8": "3:30 PM",
        "9": "4:15 PM",
        "10" : "5:00 PM"
    };

    return obj[getCurrLecture()]; 
}