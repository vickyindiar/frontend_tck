import config from '../config'
import isEmpty from 'helpers/isEmpty_helper'

const getImgUrl = (folder, isDownload, fileId, freeToken) => {
    let token = '';
    let type  = '';
    if(!isEmpty(freeToken)){
        token = freeToken;
        type = 'free'
    }
    else{
        token = localStorage.getItem('_aat') ? localStorage.getItem('_aat') : localStorage.getItem('_cat');
    }
    return isDownload ?
            `${config.apiURL}media/${folder}/download/${fileId}?tid=${token}&ttype=${type}`
            :
            `${config.apiURL}media/${folder}/${fileId}?tid=${token}&ttype=${type}`


}

export default getImgUrl