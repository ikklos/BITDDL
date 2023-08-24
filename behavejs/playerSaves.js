/**
 * playersave{
 * name savedate
 * ...
 * }
 */

export const defaultSave = {
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
    let saveList = null;
    try {
        saveList = JSON.parse(decodeURIComponent(atob(str)));
    } catch (e) {
        Swal.fire('Save Load Failed', e.toString(), 'error');
    }
    return saveList;
}