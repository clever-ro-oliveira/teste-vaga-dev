import React, { useEffect, useState } from 'react';
import api from "./services/api";
import Empresas from './components/empresas';

export default function App() {
  const initialState = {
    id : '',
    cnpj : '',
    empresa : '',
    cep : '',
    endereco : '',
    numero : '',
    bairro : '',
    estado : '',
    cidade : ''
  };

  const [state, setState] = useState(initialState);
  const [empresas, setEmpresas] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevProps) => ({
      ...prevProps,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const dados = JSON.stringify(state);

    if (state.id) {
      const edtEmpresa = async () => {
        const { data } = await api.post(
          "/edicao/" + state.id,
          dados
        );

        if(data.msg) {
          alert(data.msg)
        }
        else {
          fetchEmpresas();
          setState(initialState);
        }
      }
      edtEmpresa();

    }
    else {
      const cadEmpresa = async () => {
        const { data } = await api.post(
          "/cadastro/",
          dados
        );
        if(data.msg) {
          alert(data.msg)
        }
        else {
          const newEmpresa = [
            ...empresas,
            data
          ];
          setEmpresas(newEmpresa);
          setState(initialState);
        }
      }
      cadEmpresa();
    }
  };

  const handleEmpresaEdit = (empresaId) => {
		const fetchEmpresa = async () => {
			const { data } = await api.get(
				"/empresa/" + empresaId
			);

			setState(data);
		};

		fetchEmpresa();
	};

  const handleCancelButton = () => {
    setState(initialState);
  }

  useEffect(() => {
    fetchEmpresas();
  }, []);
  
  const fetchEmpresas = async () => {
    const { data } = await api.get(
      "/listar"
    );

    setEmpresas(data);
  };

  return (
      <div className="App">
        <form onSubmit={handleSubmit}>
          <div className="row justify-content-center mt-5">
            <div className="col-md-8 border border-dark g-0">
              <div className="p-2 bg-dark bg-opacity-10 text-dark text-start border-bottom border-dark">
                Formulário de Cadastro
              </div>
              <div className="row px-4 py-2">
                <div className="col-sm-4 text-start">
                  <label>CNPJ:</label><br />
                  <input
                  className="w-100 form-control"
                  type="text"
                  name="cnpj"
                  value={state.cnpj}
                  required
                  onChange={handleInputChange}
                  />
                </div>
                <div className="col-sm-8 text-start">
                  <label>Nome da Empresa:</label><br />
                  <input
                  className="w-100 form-control"
                  type="text"
                  name="empresa"
                  value={state.empresa}
                  required
                  onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="row px-4 py-2">
                <div className="col-sm-3 text-start">
                  <label>CEP:</label><br />
                  <input
                  className="w-100 form-control"
                  type="text"
                  name="cep"
                  value={state.cep}
                  required
                  onChange={handleInputChange}
                  />
                </div>
                <div className="col-sm-7 text-start">
                  <label>Endereço:</label><br />
                  <input
                  className="w- form-control"
                  type="text"
                  name="endereco"
                  value={state.endereco}
                  required
                  onChange={handleInputChange}
                  />
                </div>
                <div className="col-sm-2 text-start">
                  <label>Número:</label><br />
                  <input
                  className="w-100 form-control"
                  type="text"
                  name="numero"
                  value={state.numero}
                  required
                  onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="row px-4 py-2">
                <div className="col-sm-6 text-start">
                  <label>Bairro:</label><br />
                  <input
                  className="w-100 form-control"
                  type="text"
                  name="bairro"
                  value={state.bairro}
                  required
                  onChange={handleInputChange}
                  />
                </div>
                <div className="col-sm-2 text-start">
                  <label>UF:</label><br />
                  <input
                  className="w-100 form-control"
                  type="text"
                  name="estado"
                  value={state.estado}
                  required
                  onChange={handleInputChange}
                  />
                </div>
                <div className="col-sm-4 text-start">
                  <label>Cidade:</label><br />
                  <input
                  className="w-100 form-control"
                  type="text"
                  name="cidade"
                  value={state.cidade}
                  required
                  onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="row px-4 py-2">
                <div className="text-end">
                  <button className="btn bg-dark bg-opacity-25 text-white me-2 px-5" type="button" onClick={handleCancelButton}>Cancelar</button>
                  <button className="btn btn-primary px-5" type="submit">Salvar</button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="row justify-content-center mt-5">
          <div className="col-md-8 g-0">
            <div className="text-dark text-start">
              Empresas Cadastradas
            </div>
            <table class="table table-hover table-bordered border-dark border-opacity-25">
              <thead>
                <tr className="bg-dark bg-opacity-10">
                  <th width="40%" scope="col">CNPJ</th>
                  <th className="w-auto" scope="col">Nome da Empresa</th>
                  <th width="15%" scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                <Empresas
                  empresas={empresas}
                  handleEmpresaEdit={handleEmpresaEdit}
                />
              </tbody>
            </table>

          </div>
        </div>
      </div>
  );
}