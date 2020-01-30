A port of `tinyclone` from the book "Clonning Internet Applications with Ruby" using Phoenix Framework, Absinthe and Qooxdoo.

Educational material serving as exercise to familiarize myself with a variety of tools.
Not production code.

* While some concern is given to security not much attention has been applied
  as it is educational material. **Do not trust this repo in any way in production.**
  If you do, whatever happens is your fault.

* No care is given to maintain the simplicity of the original code. The goal is
  to learn to how use various tools.

* As long as I call it done I will probably abandon it to do some other project.

* Not everything is implemented. Especially:
    * No code to update the copyright notice.
    * No countries chart.
    * No container volumes for persistence

### How to use

* You need to have docker and docker-compose installed

* Clone this repo

    ```console
      $ git clone https://github.com/voger/tinyclone.git
    ```

* Build this repo

    ```console
      $ cd tinyclone
      $ vim .env
      $ docker-compose build
    ```

   Building is going to take some time. You may want to go and make some tea.

* Run this repo

  ```console
    $ docker-compose up
  ```

* Browse to the app using your prefered web browser
