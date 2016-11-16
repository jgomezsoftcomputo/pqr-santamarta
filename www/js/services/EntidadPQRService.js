/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function EntidadPQRService() {
    this.PATH = "entidad/";
}

EntidadPQRService.prototype.findByMunicipio = function (idMunicipio, callback) {
    var parameters = {};
    parameters.idMunicipio = idMunicipio;
    Middleware.getP(this.PATH + "findByIdMunicipio", parameters,  callback);
};

EntidadPQRService.prototype.findById = function (id, callback) {
    var parameters = {};
    parameters.id = id;
    Middleware.getP(this.PATH + "findById", parameters,  callback);
};




