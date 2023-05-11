import {StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import React, {useState, useEffect} from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker'; // importa o dropdown
import Api from './src/Services/Api';


function App() {


// função que conecta a api e puxa os Unidades
  
async function getUnidades() {
  try {
    //define uma constante para acessar a rota de Unidades da api
    const response = await Api.get('unidades');
    //console.log('RES API UNIDADES >>> ', response.status);

    //define uma constante para carregar a tabela de Unidade do banco
    const DataFormated = response.data.map(local => {
      return {label: local.Nome, value: local.Nome};
    });
    // guarda os dados formatados no setUnidades
    setUnidades(DataFormated);
  } catch (error) {
    console.log('ERROR API UNIDADES>>>', error);
  }
}


// função que conecta a api e puxa os medicamentos
async function getMedicamentos() {
  try {
    //define uma constante para acessar a rota de Medicamentos da api
    const response = await Api.get('Medicamentos');
    //console.log('RES API MEDICAMENTOS >>> ', response.status);

    //define uma constante para carregar a tabela de Medicamentos do banco
    const DataFormated = response.data.map(local => {
      return {label: local.Nome, value: local.Nome};// define uma label e um value a serem usados no dropDown
    });
// guarda os dados formatados no SetMedicamentos
    setMedicamentos(DataFormated);
  } catch (error) {
    console.log('ERROR API MEDICAMENTOS>>>', error);
  }
}

//função que consulta medicamentos disponiveis
async function GetMedicamentosDisponiveis() {

  //define uma constante para montar o body e fazer a consulta na api através do metodo POST

    const ArmazenaMedicamentoPost = {
  
      "Nome": `${valoresSelecionados.medicamento}`
    }
  
    //armazena a constula na constante response
    const response = await Api.post('consultaPMedicamento', ArmazenaMedicamentoPost);
    
    //armazena os dados no setMedicamento e no setTabela
    SetMedicamentosDisponiveis(response.data);
    setTabela(response.data);
  }

//função que consulta medicamentos na unidade disponivel
  async function GetMedicamentosUnidadesDisponiveis() {

    const ArmazenaMedicamentosUnidadesPost = {
  
      "Unidade": `${valoresSelecionados.unidade}`,
      "Medicamento": `${valoresSelecionados.medicamento}`
    }
   //armazena a constula na constante response
    const response = await Api.post('consultaPMedicamentoUnidade', ArmazenaMedicamentosUnidadesPost);
    //armazena os dados no SetMedicamentosUnidadeDisponiveis e no setTabela
    SetMedicamentosUnidadeDisponiveis(response.data);
    setTabela(response.data);
  }
  

  //Função para verificar se foi selecionado unidade
  async function getBotao() {
    if (!valoresSelecionados.unidade){
      await GetMedicamentosDisponiveis();

    }
    else{
       await GetMedicamentosUnidadesDisponiveis();
    }

    
    setIsDisabled([false]) //seta o botao para desabilitado
    setArmazenaMedicamento([]) // limpa os dados dessa variavel (dropdown)
    setArmazenaUnidade([]) // limpa os dados dessa variavel (dropdown)
    setValoresSelecionados([]) //limpa os dados armazenados no Valores selecionados

  }

// serve para lidar com os efeitos de conexao de api
useEffect(() => {
  getUnidades();
  getMedicamentos();
}, []);



function pegaValorsSelecionado(prop, value){
    setValoresSelecionados({...valoresSelecionados, [prop]: value})
}

  const [medselecionado, setmedselecionado] = useState(); //armazena o medicamento selecionado
  const [valoresSelecionados, setValoresSelecionados] = useState({unidade: '',medicamento: ''}); // armazena os valores selecionados
  const [ArmazenaUnidade, setArmazenaUnidade]=useState([]) // armazena item selecionado na unidade
  const [ArmazenaMedicamento, setArmazenaMedicamento]=useState([]) // armazena item selecionado no medicamento
  const [MedicamentoUnidadeDisponiveis, SetMedicamentosUnidadeDisponiveis]=useState([]) // armazena item selecionado no medicamento
  const [MedicamentosDisponiveis, SetMedicamentosDisponiveis] = useState(); // puxa as unidades do banco acessando a função getUnidades
  const [openUnidades, setOpenUnidades] = useState(false); 
  const [openMedicamentos, setopenMedicamentos] = useState(false);
  const [unidades, setUnidades] = useState(); // puxa as unidades do banco acessando a função getUnidades
  const [medicamentos, setMedicamentos] = useState(); // puxa as unidades do banco acessando a função getMedicamentos
  const [isDisabled, setIsDisabled] = useState(true); //define o botao como desabilitado
  const [Tabela, setTabela] = useState(Array()); // define tabela como uma lista
  console.log(MedicamentoUnidadeDisponiveis)
  console.log(MedicamentosDisponiveis)

  const CheckMedicamentoSelecionado = () => {
    if (!valoresSelecionados.medicamento){
      setIsDisabled(true);
    } else{
      setIsDisabled(false);
    }
    
  
  }

  //função para renderizar items da consulta do dropDown
  function renderItems({item, index}){
    if (!item.is_disponivel){
      // armazena medicamentos disponiveis na const tabela
      const Tabela = MedicamentosDisponiveis
      return <View style={styles.flat}>
        <Text style={styles.Lista_unidade}>{'Medicamento: '+ medselecionado}</Text>
        <Text style={styles.Lista_unidade}>{'Unidade: '+ item.Nome_unidade}</Text>
        <Text style={styles.Lista_Local}>{'Endereço: '+ item.Local}</Text>
        <Text style={styles.Lista_telefone}>{'Telefone: '+ item.Telefone}</Text>
        </View>
    }

    else{
      const Tabela = MedicamentoUnidadeDisponiveis
      return <View style={styles.flat}>
        <Text style={styles.Lista_unidade2}>{'Unidade: '+item.Nome_unidade}</Text>
        <Text style={styles.Lista_Medicamento}>{item.Nome_medicamento}</Text>
        <Text style={styles.Lista_disponivel}>{item.is_disponivel}</Text>
        </View>
    } 
  }


  return (

  <LinearGradient colors={["white","#76d1e3"]} style={styles.fundo}>
  <View style={styles.container}>
    
  
      <Image 
      resizeMode ={'contain'} 
      source={require('./src/Imagens/logoSUS.png')}  
      style={styles.logo}>

      </Image>
      
      <View style={styles.elementos}>
      <DropDownPicker style={styles.FiltroUnidades} 
        searchable = {true}//habilita o campo de pesquisa
        zIndex={2} //define a indexação de sobreposição de um item e outro
        open={openUnidades}//função de abertura do dropdown
        value={ArmazenaUnidade} //armazena o valor selecionado
        items={unidades} //sao os itens mostrados no dropdown
        setOpen={setOpenUnidades} // identifica a alteração da abertura do drop down
        setValue={setArmazenaUnidade} // função que identifica a alteração dos valores
        setItems={setUnidades} // função que identifica a alteração dos items
        placeholder={'Selecione uma Unidade'} //altera o nome dentro do dropdown
        searchPlaceholder={'Digite o Nome da Unidade'}//altera o nome dentro do campo pesquisa
        onChangeValue={value => pegaValorsSelecionado('unidade',value)} //função que verifica o item alterado no dropdown
        
        
        






//função para o item selecionado no dropdown
//função que verifica o item alterado no dropdown
        />
      <DropDownPicker style={styles.FiltroMedicamentos}
        searchable = {true} //habilita o campo de pesquisa
        zIndex={1} //define a indexação de sobreposição de um item e outro
        open={openMedicamentos} // função de abertura do dropdown
        value={ArmazenaMedicamento} //armazena o valor selecionado
        items={medicamentos} // sao os itens mostrados no dropdown
        setOpen={setopenMedicamentos} // identifica a alteração da abertura do drop down
        setValue={setArmazenaMedicamento} // função que identifica a alteração dos valores
        setItems={setMedicamentos} // função que identifica a alteração dos items
        placeholder={'Selecione um Medicamento'} // altera o nome dentro do dropdown
        searchPlaceholder={'Digite o Nome do Medicamento'} // altera o nome dentro do campo pesquisa
        onSelectItem={item => CheckMedicamentoSelecionado()&setmedselecionado(item.value)} // função para o item selecionado no dropdown
        onChangeValue={value => pegaValorsSelecionado('medicamento',value)} //função que verifica o item alterado no dropdown
        

      />



      

      <View style={styles.botoes} >

      <TouchableOpacity style={styles.BotaoAtivado} onPress={() => getBotao()}
        disabled={isDisabled}
        >
          <Text style={styles.TextoBotao}>Pesquisar</Text>
      
          {isDisabled && <View style={styles.BotaoDesativado}/>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.botaoLimpar} onPress={() => setArmazenaMedicamento([])&setArmazenaUnidade([])}
        >
          <Text style={styles.TextoBotao}>Limpar</Text>
      </TouchableOpacity>

      </View>

      <View style={styles.divisao}>

      </View>
      <FlatList styles={styles.flat}
        data={Tabela}
        renderItem={renderItems}
        showsVerticalScrollIndicator={false}
      />
      </View>
      
      
  </View>
  </LinearGradient> 

  
    );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    width:'100%',
    height:'100%'
  },

  fundo:{
  flex:1,

}, 

logo:{
  width:'100%',
  height:250
},
elementos:{
  width:'90%',
  alignSelf:'center',
  alignItems:'center'

  },

  FiltroUnidades:{
    marginBottom:10
  },
  FiltroMedicamentos:{
    marginBottom:10
  },

  botoes:{
    flexDirection:'row',
  },
  BotaoAtivado: {
    width: 150,
    height: 35,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    textAlign: 'center',
    borderRadius: 10,
    
  },
  
  BotaoDesativado: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor:'white',
    opacity:0.6,
    position:'absolute',
    color:'white',
  },
  TextoBotao: {
    paddingTop:4,
    color:'white',
    fontSize:18,
  },

  botaoLimpar:{
    marginLeft:10,
    width: 150,
    height: 35,
    backgroundColor: 'gray',
    borderRadius: 5,
    textAlign: 'center',
    borderRadius: 10,
  },
  TextoMedicamento:{
    marginTop:10,
    fontSize:16
  },
  
  divisao:{
    flex:1,
    borderWidth:1,
    borderColor:'black',
    marginTop:10,
    width:'110%'


  },
  flat:{
    paddingTop:10,
    paddingLeft:5,
    paddingRight:5,
    marginTop:10,
    paddingBottom:10,
    borderWidth:2,
    borderColor:'black',
    borderRadius:10,
  },

});


export default App;
