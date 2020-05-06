import React, {useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {FiPower, FiTrash2} from "react-icons/fi";

import api from '../../services/api'
import './styles.css'

export default function Profile() {

    const userCpf = localStorage.getItem('userCpf')
    const userName = localStorage.getItem('userName')
    const [produtos, setProdutos] = useState([]);

    const history = useHistory()

    useEffect(() => {
        api.get('produtoslistar',{
            headers:{
                Authorization: userCpf,
            }
        }).then(response => {
            setProdutos(response.data);
        })
    }, [userCpf]);//vazio executa uma unica vez

    async function handleDeleteIncident(id){
        try{
            await api.delete(`/produtos/${id}`,{
                headers:{
                    Authorization: userCpf,
                }
            })
            //pega todos os incidents e filtra, mostrando os ids que sao diferentes dos que foram deletados
            //fazendo sumir para o usuario os incidents deletados
            setProdutos(produtos.filter(produto => produto.id !== id));
        }catch (err) {
            alert('Erro ao deletar caso, tente novamente.')
        }
    }
    function handleLogout() {
        localStorage.clear()
        history.push('/')
    }

    return (
        <div >
            <header>
                <span>Bem vindo {userName}</span>
                <Link className="button" to="/newproduct"> Cadastrar Produto</Link>
            </header>
            <button onClick={handleLogout} type="button">
                <FiPower  size={18} color="#E02041"/>
            </button>

            <ul>
                {produtos.map(produto => (
                    <li key={produto.id}>
                        <strong>CASO:</strong>
                        <p>{produto.title}</p>
                        <strong>DESCRIÇÃO</strong>
                        <p>{produto.description}</p>
                        <strong>VALOR</strong>
                        <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(produto.value)}</p>
                        <strong>Contato do Vendedor</strong>
                        <p>{produto.email}</p>
                        <p>{produto.whatsapp}</p>
                        <p>{produto.city}</p>
                        <p>{produto.uf}</p>
                        <button onClick={() => handleDeleteIncident(produto.id) } type="button">
                            <FiTrash2 size={20} color="#a8ab3"/>
                        </button>
                    </li>
                ))}
            </ul>

        </div>
    )
}