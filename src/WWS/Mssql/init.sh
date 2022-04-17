

# If the database does not exist is was not persisted, initialize it.
if [ ! -f /var/opt/mssql/data/WWS.mdf ]; then
    echo "WWS databse does not exist. Creating database..."
    function initialize_app_database() {
        # Do this in a loop because the timing for when the SQL instance is ready is indeterminate
        sleep 30s
        for i in {1..50};
        do
            /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P WWSPass420* -d master -i base.sql
            if [ $? -eq 0 ]
            then
                echo "base.sql completed"
                break
            else
                echo "not ready yet..."
                sleep 1
            fi
        done
    }
    initialize_app_database &
fi