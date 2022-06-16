## CentrostalAPI _by Mateusz Kisiel_

### O repozytorium:
Projekt składa się z backendu (ASP.NET Core Web Api - Rest w C#) oraz frontendu napisanego w React'cie.
To repozytorium zawiera sam backend (frontend jest w innym).

### Opis projektu:
Projekt ma za zadanie zarzadzać magazynem części (w tym przypadku części do wypalarki plazmowej). 

Po zalogowaniu użytkownik może wyszukać i filtrować części znajdujące się na magazynie. Jeżeli ilość którejść spadnie poniżej zapasu minimalnego osoba pracująca na magazynie może rozpocząć zamówienie z potrzebnymi częściami. Następnie zamówienie te musi zatwierdzić kierownik (na każdym etapie można anulować lub edytować zamówienie). Nastpenie zatwierdza prezes i wtedy może dojść do zamówienie u dostawcy. Gdy części dojdą pracownik zatwierdza to w aplikacji, a ilości magazynowe się aktualizują. 

W przypadku wydawania części może to zrobić pracownik magazynu samemu.

Wszystkie zamówienia zapisują się w historii, i nie ma możliwości, że ktoś oszuka.

### Screeny programu:

![](screenshots/screen1menu.jpg)
![](screenshots/screen5zamowienia.jpg)
![](screenshots/screen3edycja.jpg)
![](screenshots/screen4ceny.jpg)
![](screenshots/screen6magazyn.jpg)

### Jak uruchomić:
#### Backand:
1) Dodać dane dostępu do bazy danych SQL Server do projektu
2) Wywołać Update-Database aby wykonać migracje
3) Odpalić serwer
4) Dodać userów poprzez request do /register w Swaggerze lub Postmanie
5) Ustawić user roles w sql'u w tabeli userRoles 

#### Frontend:
1) Ustawić adres serwera api w pliku .env
2) Odpalić npm install
3) Odpalić npm start