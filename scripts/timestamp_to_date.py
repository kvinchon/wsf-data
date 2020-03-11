#!/usr/bin/python
import psycopg2
from config import config
from update_fronius import update_fronius
 
def connect():
    """ Connect to the PostgreSQL database server """
    conn = None
    try:
        # read connection parameters
        params = config()
 
        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)
      
        # create a cursor
        cur = conn.cursor()
        
   # execute a statement
        print('Retrieving data from database...')
        cur.execute('SELECT id, timestamp FROM history_fronius_1')
 
        # returns all the rows as a list of tuples
        records = cur.fetchall()

         # close the communication with the PostgreSQL
        cur.close()

        print("Updating database...")
        # converting timestamp to date and updating database
        update_fronius(records)
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')
 
 
if __name__ == '__main__':
    connect()