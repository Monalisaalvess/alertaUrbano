import { Link } from "react-router-dom"
import "./About.css"

const About = () => {
  return (
    <div className='about'>
        <div className="txt__about">
       <h1>Sobre o projeto</h1>
        <p>
        O Alerta Urbano é um sistema de comunicação digital pensado e desenvolvido para a população do Crato como parte de um projeto acadêmico da faculdade. Seu objetivo é criar um canal acessível e eficiente, permitindo que os cidadãos relatem problemas urbanos e recebam informações de interesse público.
        </p>

        <p>
        No entanto, é importante destacar que as reclamações enviadas por meio desta plataforma não possuem garantia de recebimento ou atendimento pela prefeitura, pois o projeto ainda está em fase de desenvolvimento e <span>não se trata de uma iniciativa oficial.</span>
        </p>

        <Link to='/' className='btn_back'> <i className="fa-solid fa-arrow-left"></i> Voltar para o início</Link>
        </div>
    </div>
  )
}

export default About