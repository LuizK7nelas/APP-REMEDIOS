import mysql.connector
import pandas as pd
import logging.handlers  
from datetime import date, datetime
import time, sys


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

def consultaPMedicamento():
    try:
        con = mysql.connector.connect(host='localhost',database='db_saude',user='root',password='root')
        BuscaMedicamento = ''
        print(BuscaMedicamento)
        query = f"""SELECT  u.nome_unidade FROM db_saude.tbl_dispomed D inner join db_saude.tbl_medicamentos M on D.id_medicamento = M.id_medicamento inner join db_saude.tbl_unidades U on D.id_unidade = U.id_unidade where is_disponivel = 'S' and M.nome_medicamento = '{BuscaMedicamento}'"""
        cursor = con.cursor()
        cursor.execute(query)
        MedicamentosDisponiveis = cursor.fetchall()
        Disponiveis = list()

        for Disponivel in MedicamentosDisponiveis:
            Disponiveis.append(
            {
                'Nome_unidade': Disponivel[0]
            }
            )
        return Disponiveis
    except Exception as e: 
        print((e))

def consultaPMedicamentoUnidade():
    try:
        con = mysql.connector.connect(host='localhost',database='db_saude',user='root',password='root')
        BuscaMedicamentoUnidade =''
        BuscaUnidade = ''
        query = f"""SELECT 
                        u.nome_unidade,
                        M.nome_medicamento

                        FROM db_saude.tbl_dispomed D

                        inner join db_saude.tbl_medicamentos M
                        on D.id_medicamento = M.id_medicamento

                        inner join db_saude.tbl_unidades U
                        on D.id_unidade = U.id_unidade

                        where is_disponivel = 'S' and M.nome_medicamento = '{BuscaMedicamentoUnidade}'and U.nome_unidade ='{BuscaUnidade}'"""
        cursor = con.cursor()
        cursor.execute(query)
        MedicamentosDisponiveis = cursor.fetchall()
        Disponiveis = list()

        for Disponivel in MedicamentosDisponiveis:
            Disponiveis.append(
            {
                    'Nome_unidade': Disponivel[0],
                    'Nome_medicamento': Disponivel[1]
            }
            )
        return Disponiveis
    except Exception as e: 
        print((e))
