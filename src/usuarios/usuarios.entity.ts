import { TipoUsuario } from "src/enums/tipo-usuario.enum";
import { BeforeInsert, BeforeUpdate, Column, Entity, Exclusion, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { EntityGeneric } from "src/shared/generic/entity-generic.entity";
import { classToPlain, Exclude, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Usuarios extends EntityGeneric{
    @Column()
    nombre:string;

    @Column({unique: true})
    login:string;
 
    @Exclude({ toPlainOnly: true})
    @Column({length: 70, nullable: true})
    contrasena:string;
     

    @Column()
    tipo_usuario:TipoUsuario;

     @BeforeInsert()
     @BeforeUpdate()
     async hashPassword(){
         if(!this.contrasena){
            this.contrasena = this.login;
         }
         const salt = await bcrypt.genSalt();
         this.contrasena = await bcrypt.hash(this.contrasena,salt);
     }

     async validarPassword(password:string){
        return await bcrypt.compareSync(password,this.contrasena);
     }


     toJSON() {
        return classToPlain(this);
      }

     
}