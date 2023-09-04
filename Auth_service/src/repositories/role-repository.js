const CrudRepository = require('./crud-repository');
const { Role } = require('../models');


class RoleRepository extends CrudRepository {
    constructor() {
        super(Role);
    }

    async getRoleByName(name){
        const role= await Role.findOne({where:{name:name}})
        console.log(role.id)
        return role
       }
}



    module.exports = RoleRepository;