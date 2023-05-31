import React from "react";

import Empresa from "./empresa";

const Empresas = ({ empresas, handleEmpresaEdit }) => {
	return (
		<>
			{empresas.map((empresa) => (
				<Empresa 
                    empresa={empresa}
                    handleEmpresaEdit={handleEmpresaEdit}
				/>
			))}
		</>
	);
};

export default Empresas;