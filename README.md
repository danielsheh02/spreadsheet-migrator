# Плагин для переноса данных из таблиц в систему TestY

## Установка
Необходимо установить пакет плагина, используя команду `pip install spreadsheet-migrator`.

#### Локальный запуск
Для работы плагина и хранения отчетов о переносе данных в систему, необходимо создать каталог под 
названием `testy_spreadsheet_reports` во временной директории (tmp) операционной системы.

#### Запуск в docker контейнере
Необходимо создать каталог под названием `testy_spreadsheet_reports` во временной директории (tmp) операционной системы 
внутри контейнера. Рекомендуется это сделать путем создания тома:

    volumes:
        - ./reports:/tmp/testy_spreadsheet_reports

## Инструкция пользователя
Для переноса данных в Testy из таблицы необходимо в форме
генерации данных выбрать файл расширения .xlsx и выбрать
соответствующие колонки с именами, описаниями и прочими атрибутами для
сущностей. Таблицы обязательно должны содержать заголовок, либо необходимо оставить пустой первую строку.
В случае если для обязательного атрибута сущности не
указана колонка или значение в ячейке для обязательного атрибута отсутствует, а так же если
сущность с такими же атрибутами уже существует в базе данных, она не будет создана. При успешном
завершении переноса данных будет доступна ссылка на отчет о проделанной работе.

![Not found](https://camo.githubusercontent.com/e8378ee5247b6a73166c4f67c6c07ab2c5634409f39da7ea5d05c261407b3fa0/68747470733a2f2f64726976652e676f6f676c652e636f6d2f75633f69643d31444f345f447338753775586b5a4969464139754548756c79676349514d4c3541)

### Сьюты
Для создания сьют необходимо указать имя (обязательно) и описание (опционально):

| Имя сьюты | Описание сьюты  | 
|:---------:|:---------------:|
|  Сьюта 1  |     Сьюта 1     |     
|  Сьюта 2  |     Сьюта 2     |
|  Сьюта 3  |     Сьюта 3     |

### Тест-кейсы
Для создания тест-кейса необходимо указать сьюту (обязательно),
которой будет принадлежать тест-кейс, имя (обязательно),
сценарий (обязательно), остальные атрибуты опционально:

| Имя сьюты | Описание сьюты | Имя кейса | Сценарий кейса | Описание кейса | Подготовка | Очистка | Время выполнения |
|:---------:|:--------------:|:---------:|:--------------:|:--------------:|:----------:|:-------:|:----------------:|
|  Сьюта 1  |    Сьюта 1     |  Кейс 1   |     Кейс 1     |     Кейс 1     |   Кейс 1   | Кейс 1  |       100        |
|  Сьюта 2  |    Сьюта 2     |  Кейс 2   |     Кейс 2     |     Кейс 2     |   Кейс 2   | Кейс 2  |       200        |
|  Сьюта 3  |                |  Кейс 3   |     Кейс 3     |                |            |         |                  |

### Параметры
Для создания параметров необходимо описать данные в следующем формате:
после имени группы ставится ":", параметры из одной группы отделяются ";", группы отделяются ";/n" 
(точка с запятой с переносом строки), если группы указаны в одной ячейке таблицы.

| Параметры                                                                           | 
|:------------------------------------------------------------------------------------|
| GROUP NAME1: PARAMETER1; PARAMETER2;<br/> GROUP NAME2: PARAMETER1; PARAMETER2;<br/> |
| OS: LINUX; WINDOWS;<br/> BROWSER: CHROME; YANDEX;<br/>                              |    
| MOBILE OS: ANDROID; IOS;                                                            |

### Тест-планы
Для создания тест-плана необходимо указать имя (обязательно), описание и
время UTC начала и окончания тест плана. Если время не будет указано, то будет установлено текущее
время UTC. 

Предупреждение: одинаковыми объектами считаются те, у которых все поля совпадают.
Это значит, что тест-планы, в которых не указано время, будут всегда создаваться при повторном 
запуске генерации, так как устанавливается текущее время UTC.

| Имя плана | Описание плана |   Время начала   |    Время окончания    |
|:---------:|:--------------:|:----------------:|:---------------------:|
|  План 1   |     План 1     | 01.01.2023 00:00 |   10.01.2023 00:00    |
|  План 2   |     План 2     | 01.01.2023 00:00 |   10.01.2023 00:00    |
|  План 3   |                | 01.01.2023 00:00 |   10.01.2023 00:00    |

В случае необходимости создать тест-планы с параметрами, 
нужно указать данные о параметрах:

| Параметры                                              | Имя плана | Описание плана |   Время начала   |    Время окончания    |
|:-------------------------------------------------------|:---------:|:--------------:|:----------------:|:---------------------:|
| OS: LINUX; WINDOWS;<br/> BROWSER: CHROME; YANDEX;<br/> |  План 1   |     План 1     | 01.01.2023 00:00 |   10.01.2023 00:00    |
| OS: LINUX; WINDOWS;<br/> BROWSER: CHROME; YANDEX;<br/> |  План 2   |     План 2     | 01.01.2023 00:00 |   10.01.2023 00:00    |
| OS: LINUX; WINDOWS;<br/> BROWSER: CHROME; YANDEX;<br/> |  План 3   |                | 01.01.2023 00:00 |   10.01.2023 00:00    |

Будет создано 4 тест-плана на каждую строку с комбинациями параметров: 

План 1 [LINUX, CHROME], План 1 [LINUX, YANDEX], План 1 [WINDOWS, CHROME], План 1 [WINDOWS, YANDEX].

В случае необходимости создать тест-планы и сгенерировать в них тесты, нужно указать данные о сьютах и тест-кейсах.

Генерация тестов с параметрами:

|  Имя сьюты  |    Имя кейса     |  Сценарий кейса  | Параметры                                              | Имя плана |   Время начала   |    Время окончания    |
|:-----------:|:----------------:|:----------------:|:-------------------------------------------------------|:---------:|:----------------:|:---------------------:|
| Авторизация |       Вход       |       Вход       | OS: LINUX; WINDOWS;<br/> BROWSER: CHROME; YANDEX;<br/> |   План    | 01.01.2023 00:00 |   10.01.2023 00:00    |
| Авторизация |      Выход       |      Выход       | OS: LINUX; WINDOWS;<br/> BROWSER: CHROME; YANDEX;<br/> |   План    | 01.01.2023 00:00 |   10.01.2023 00:00    |
|  Создание   | Создание объекта | Создание объекта | OS: LINUX; WINDOWS;<br/> BROWSER: CHROME; YANDEX;<br/> |   План    | 01.01.2023 00:00 |   10.01.2023 00:00    |

Будет создано 4 тест-плана с комбинациями параметров, в каждом из которых будет по 3 теста: 
"Вход", "Выход", "Создание объекта".

Генерация тестов без параметров:

|  Имя сьюты  |    Имя кейса     |  Сценарий кейса  | Имя плана |   Время начала   |    Время окончания    |
|:-----------:|:----------------:|:----------------:|:---------:|:----------------:|:---------------------:|
| Авторизация |       Вход       |       Вход       |   План    | 01.01.2023 00:00 |   10.01.2023 00:00    |
| Авторизация |      Выход       |      Выход       |   План    | 01.01.2023 00:00 |   10.01.2023 00:00    |
|  Создание   | Создание объекта | Создание объекта |   План    | 01.01.2023 00:00 |   10.01.2023 00:00    |

Будет создан тест-план с 3 тестами: "Вход", "Выход", "Создание объекта".

## Тестирование
Написаны интеграционные тесты с реальными запросами к API при помощи фреймворка [Pytest](https://docs.pytest.org/en/7.3.x/contents.html). 
Перед тестированием необходимо запустить базу данных, а также создать каталог под названием 
`testy_spreadsheet_reports` во временной директории (tmp) операционной системы.
