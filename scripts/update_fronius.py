#!/usr/bin/python
 
import psycopg2
from datetime import datetime
from config import config
 
 
def update_fronius(tuple_list: list) -> int:
    """ update history_fronius timestamp based on the id """
    sql = """ UPDATE history_fronius_1
                SET timestamp = %s
                WHERE id = %s"""
    conn = None
    try:
        # read database configuration
        params = config()
        # connect to the PostgreSQL database
        conn = psycopg2.connect(**params)
        # create a new cursor
        cur = conn.cursor()
        # execute the UPDATE statement
        for tpl in tuple_list:
            fronius_id = tpl[0]
            try:
                timestamp = int(tpl[1])
                timestamp_to_date = datetime.utcfromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')

                print("UPDATE history_fronius_1 SET timestamp =", timestamp_to_date, "WHERE id =", fronius_id)
                cur.execute(sql, (timestamp_to_date, fronius_id))

                # Commit the changes to the database
                conn.commit()
            except ValueError:
                print('Error: could not convert data to an integer')

        # Close communication with the PostgreSQL database
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()