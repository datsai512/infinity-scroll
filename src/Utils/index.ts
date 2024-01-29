

export const querySearchToObject = (querry:string) => {
    const objectQuerry : any = {}
    const arrayAffterSplitQuerry = querry.split(/[\?{0,1}.+?(=.+?(&))]{1,}/img);
    arrayAffterSplitQuerry.shift();
    for(let i = 0; i < arrayAffterSplitQuerry.length; i+=2) {
        const key = arrayAffterSplitQuerry[i];
        const value = arrayAffterSplitQuerry[i+1];
        objectQuerry[key] = value;
    }
    return objectQuerry;
}

export const objectToQuerySearch = (object : object | any) => {
    let str = '';
    for (let key in object) {
        if(!str.startsWith('?')) {
            str = `?${key}=${object[key]}`;
        } else {
            str = str + `&${key}=${object[key]}`;
        }
    }
    return str;
}


export const concatQuerySearch = (data: any, currentQuerry?:string) => {
    const currentQuerySearch = currentQuerry || window.location.search;
    
    const currentQuerySearchObject = querySearchToObject(currentQuerySearch);
    for(let key in data) {
        const newValue = data[key];
        const preValue = currentQuerySearchObject[key];
        if(preValue) {
            if(preValue !== newValue) {
                currentQuerySearchObject[key] = newValue;
            } 
        } else {
            currentQuerySearchObject[key] =newValue;
        }
     
    }
    const querry = objectToQuerySearch(currentQuerySearchObject)
    return querry;
}