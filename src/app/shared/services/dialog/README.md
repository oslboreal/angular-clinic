# Dialog Service
## Author: Juan Marcos Vallejo.


#Usage:

- Add the service to the desired module. (AppModule by default).
- Inject the model to your component by using the Angular Injector.
- Add the dialog template to your component:
`

`
- Create a method to handle the event that would show your dialog:
`
            <!-- Your component HTML -->
            <!-- In this case we are using (click) -->
            <button style="background-color: #B10F2E; border-color: #B10F2E;" type="button" class="btn btn-secondary"
                (click)="showLoginForm(loginForm)">Log In</button>
`
`
  showLoginForm(content: TemplateRef<LoginComponent>) {
    this.dialogService.setDialog(DialogEventType.open, content);
  }
`

