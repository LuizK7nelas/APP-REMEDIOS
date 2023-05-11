from flask import Flask, request
from flask_cors import CORS
from flask import Flask, jsonify
import mysql.connector


def unidades():

    try:
        con = mysql.connector.connect(host='localhost',database='db_saude',user='root',password='root')
        query = 'SELECT * FROM db_saude.tbl_unidades;'
        cursor = con.cursor()
        cursor.execute(query)
        unidadesBD = cursor.fetchall()
        unidades = list()
        for unidade in unidadesBD:
            unidades.append(
            {
                'id': unidade[0],
                'Nome': unidade[1],
                'Local': unidade[2],
                'Telefone': unidade[3],
                'Tipo': unidade[4]
            }
            )
        return unidades
    except Exception as e: 
        print((e))
def Medicamentos():
    try:
        con = mysql.connector.connect(host='localhost',database='db_saude',user='root',password='root')
        query = "SELECT * FROM db_saude.tbl_medicamentos;"
        cursor = con.cursor()
        cursor.execute(query)
        MedicamentosBD = cursor.fetchall()
        Medicamentos = list()
        for Medicamento in MedicamentosBD:
            Medicamentos.append(
            {
                'id':Medicamento[0],
                'Nome': Medicamento[1]
            }
            )
        return Medicamentos
    except Exception as e: 
        print((e))

def consultaPMedicamento(medicamento):
    try:
        con = mysql.connector.connect(host='localhost',database='db_saude',user='root',password='root') 
        #BuscaMedicamento = PostconsultaPMedicamento(medicamento)
        query = f"""SELECT  u.nome_unidade , u.telefone_unidade, u.local_unidade FROM db_saude.tbl_dispomed D inner join db_saude.tbl_medicamentos M on D.id_medicamento = M.id_medicamento inner join db_saude.tbl_unidades U on D.id_unidade = U.id_unidade where is_disponivel = 'S' and M.nome_medicamento = '{medicamento}'"""
        cursor = con.cursor()
        cursor.execute(query)
        MedicamentosDisponiveis = cursor.fetchall()
        Disponiveis = list()

        for Disponivel in MedicamentosDisponiveis:
            Disponiveis.append(
            {
                'Nome_unidade': Disponivel[0],
                'Telefone':Disponivel[1],
                'Local':Disponivel[2]
            }
            )
        return Disponiveis
    except Exception as e: 
        print((e))

def consultaPMedicamentoUnidade(medicamento,unidade):
    try:
        con = mysql.connector.connect(host='localhost',database='db_saude',user='root',password='root')
        query = f"""SELECT 
                    M.nome_medicamento,
                    U.nome_unidade,
                    CASE is_disponivel 
                    WHEN 'S' THEN 'Está disponível nesta Unidade' 
                    WHEN 'N' THEN 'Não está disponível nesta Unidade'
                    END AS Desc_disponivel
                    FROM db_saude.tbl_dispomed D

                    inner join db_saude.tbl_medicamentos M
                    on D.id_medicamento = M.id_medicamento

                    inner join db_saude.tbl_unidades U
                    on D.id_unidade = U.id_unidade


                         where  U.nome_unidade = '{unidade}' and M.nome_medicamento = '{medicamento}'"""
        cursor = con.cursor()
        cursor.execute(query)
        MedicamentosDisponiveis = cursor.fetchall()
        Disponiveis = list()

        for Disponivel in MedicamentosDisponiveis:
            Disponiveis.append(
            {
                    'Nome_unidade': Disponivel[1],
                    'Nome_medicamento': Disponivel[0],
                    'is_disponivel':Disponivel[2]
            }
            )
        return Disponiveis
    except Exception as e: 
        print((e))

#=============================================================================================================================================================#
#=============================================================================================================================================================#
#=============================================================================================================================================================#
#=============================================================================================================================================================#


app = Flask(__name__)
CORS(app)


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

try:

    @app.route('/unidades',methods = ['GET'])
    def obterUnidades():
        return jsonify(unidades())

    @app.route('/Medicamentos',methods = ['GET'])   
    def obterMedicamentos():
        return jsonify(Medicamentos())


    @app.route('/consultaPMedicamento',methods = ['POST'])
    def PostconsultaPMedicamento():
        body = request.get_json()
        medicamento = body['Nome']
        return jsonify(consultaPMedicamento(medicamento))

    @app.route('/consultaPMedicamentoUnidade',methods = ['POST'])
    def ObterconsultaPMedicamentoUnidade():
        body = request.get_json()
        unidade =  body['Unidade']
        medicamento = body['Medicamento']
        return jsonify(consultaPMedicamentoUnidade(medicamento,unidade))

except Exception as e: 
        print((e))


from gevent.pywsgi import WSGIServer

http_server = WSGIServer(('localhost', 3000), app)
http_server.serve_forever()

#app.run(port=3000,host='localhost',debug=False)
