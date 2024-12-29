import 'cypress-file-upload';

describe('Prueba de inicio de sesión del Supervisor', () => {

  it('Debería iniciar sesión como supervisor utilizando su usuario y contraseña y además usando un archivo de contraseña', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type="checkbox"]').first().check();
    cy.get('input#username').type('supervisor');
    cy.get('input#password').type('123');
    cy.get('input[type="checkbox"]').eq(1).check();
    const filePath = 'pass.ayd';
    cy.get('input[type="file"]').attachFile(filePath);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/supervisor/perfil');
  });



  it('Debería mostrar un error si la contraseña del supervisor es incorrecta', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type="checkbox"]').first().check();
    cy.get('input#username').type('supervisor');
    cy.get('input#password').type('12adsf3'); 
    cy.get('input[type="checkbox"]').eq(1).check();
    const filePath = 'pass.ayd';
    cy.get('input[type="file"]').attachFile(filePath);
    cy.get('button[type="submit"]').click();
    cy.contains('Contraseña incorrecta').should('be.visible');
  });




  it('Debería mostrar un error si el archivo .ayd es incorrecto', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type="checkbox"]').first().check();
    cy.get('input#username').type('supervisor');
    cy.get('input#password').type('123'); // Contraseña correcta
    cy.get('input[type="checkbox"]').eq(1).check();
    const invalidFilePath = 'err.ayd'; 
    cy.get('input[type="file"]').attachFile(invalidFilePath);
    cy.get('button[type="submit"]').click();
    cy.contains('La contraseña secundaria (ContrasenaS) no es correcta.').should('be.visible');
  });



  it('Debería mostrar un error si no se selecciona el checkbox de supervisor', () => {
    cy.visit('http://localhost:3000/');
    cy.get('input[type="checkbox"]').first().check();
    cy.get('input#username').type('supervisor');
    cy.get('input#password').type('123'); // Contraseña correcta
    cy.get('button[type="submit"]').click();
    cy.contains('El campo ContrasenaS es obligatorio para el rol de supervisor.').should('be.visible');
  });

});
