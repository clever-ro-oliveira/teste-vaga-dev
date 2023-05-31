import React from "react";
import api from "../services/api";


const Empresa = ({ empresa, handleEmpresaEdit }) => {

	return (
		<>
            <tr>
                <td>{empresa.cnpj}</td>
                <td>{empresa.empresa}</td>
                <td><a href="#" onClick={() => handleEmpresaEdit(empresa.id)} >Edit</a></td>
            </tr>
        </>
	);
};

export default Empresa;