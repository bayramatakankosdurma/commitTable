# CommitTablo

<p>&nbsp;This project is a product of my angular and javascript learning process. It might be a little spaghetti code but i added comment lines to every function and necessary points.</p>
<br>
<br>
<p>&nbsp;About the project, it is a project that works with gitlab api. When served, project takes a token from you and it controls if the token is valid or not. After that, if token is valid it brings the groups. When you choose a group, it brings projects and after you choose projects it brings the projects committers. After choosing committers, you can click the button. Button click invokes a function and brings the data of how many commits the committers have for each project that has been chosen.</p>

<br>
<br>
<p>
&nbsp;In order to use project for your intentions, need to make a few changes in project. You will make the changes in app.component.ts file. Open it and make these following changes:
1)You need to change namespace. In line 83, 103, 142 and 190, erase the yourNameSpace.com and put your own namespace.
2)You need to change mail extension. In line 179 and 226, erase the yourEmailExtension and put the mail extension of your company. This will make the project bring only the company related committers.
  </p>
<br>
<br>
<p>
After the changes, you are ready to use the project. When the editor is in project folder, open a new terminal and type "ng s". Then submit a token and see the magic.
</p>

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.


