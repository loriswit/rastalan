# RastaLAN

Le formulaire d'inscription pour la [RastaLAN](https://rastalan.ch) !

## Variables d'environnements

| Nom               | Description                                |
| ----------------- | ------------------------------------------ |
| `DATABASE_URL`    | Database connection string (Postgres)      |
| `DOOR_DEVICE`     | SwitchBot Bot device ID                    |
| `DOOR_TOKEN`      | SwitchBot API token                        |
| `DOOR_SECRET`     | SwitchBot API secret                       |
| `LAN_MODE`        | Set to true if running in the LAN          |
| `LAN_CLIENTS_CMD` | Shell command that lists connected clients |
| `LAN_SERVICES`    | List of available services in the LAN      |

## Base de données

Définition des tables :

```sql
create table event
(
    id         integer generated always as identity primary key,
    name       text                     not null unique,
    number     integer                  not null unique,
    start_date timestamp with time zone not null,
    end_date   timestamp with time zone not null
);

create table registration
(
    id                  integer generated always as identity primary key,
    name                text                                   not null unique,
    hardware            json                                   not null,
    days                json                                   not null,
    conditions_read     boolean                  default false not null,
    conditions_accepted boolean                  default false not null,
    date                timestamp with time zone default now() not null,
    registered          boolean                  default true  not null,
    event_id            integer                                not null references event
);
```
