/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function FileEntryService() {
    this.PATH = "fileEntry/";
}

FileEntryService.prototype.findFile = function (idFile, callback) {
    if (idFile) {
        var parameters = {};
        parameters.idFile = idFile;
        Middleware.getP(this.PATH + "findFile", parameters, callback);
    }
};