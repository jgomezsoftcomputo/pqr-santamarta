/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function MunicipiosService(){
     this.PATH = "resourcespqr/";
}

MunicipiosService.prototype.findByDepartamento = function (idDepartamento, callback){
    var parameters = {idDepartamento : idDepartamento};
     Middleware.getP(this.PATH + "municipios", parameters, callback);
};

MunicipiosService.prototype.getMunicipio = function (idMunicipio, callback) {
    var parameters = {};
    parameters.idMunicipio = idMunicipio;
    Middleware.getP(this.PATH + "getMunicipio", parameters, callback);
};
