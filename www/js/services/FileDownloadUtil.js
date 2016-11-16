function FileDownloadUtil() {}

FileDownloadUtil.prototype.dataURLtoBlob = function (dataURI, dataTYPE) {
    
    var binary = atob(dataURI.split(',')[1]), array = [];
    for (var i = 0; i < binary.length; i++)
        array.push(binary.charCodeAt(i));
    return new Blob([new Uint8Array(array)], {type: dataTYPE});
};

FileDownloadUtil.prototype.download = function (fileName, dataURI, dataTYPE) {
    if (fileName !== '') {
        var blob = this.dataURLtoBlob(dataURI, dataTYPE);
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    } else {
        alert("No se encontro archivo");
    }

};


