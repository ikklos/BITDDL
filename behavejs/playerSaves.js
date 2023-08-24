import Swal from '../Lib/sweetalert2.all.js';
/**
 * playersave{
 * name savedate
 * ...
 * }
 */

const defaultSave = {
    playerName: 'tav',
    saveDate: '2077-8-20-23-55',
    password: '123'
};

/*addNewSave: {
    let temp;
    Object.assign(temp, [defaultSave]);
    saveList.push(temp);
    return saveList.length - 1;
}*/

export function getSaveString(saveList) {
    return btoa(encodeURIComponent(JSON.stringify(saveList)));
}

export function readSaveString(str) {
    saveList = null;
    try {
        saveList = JSON.parse(decodeURIComponent(atob(str)));
    } catch (e) {
        Swal.fire('Save Load Failed', e, 'error');
    }
    return saveList;
}