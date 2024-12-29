import 'cypress-file-upload';

describe('Flujo para registrar un administrador', () => {
  
  const adminTestData = {
    nombreUsuario: 'adminTest',
    correo: 'adminTest@example.com',
    nombre: 'Admin',
    apellido: 'Test',
    telefono: '1234567890',
    fotografia: 'perfil.png',
    genero: 'Masculino',
    estadoCivil: 'Soltero',
    estado: 'Alta',
  };

  it('Debería loguearse como supervisor y registrar un administrador exitosamente', () => {
    cy.visit('http://localhost:3000/supervisor/registrar-admin');

    // Completar el formulario con los datos de prueba
    cy.get('input#nombreUsuario').type(adminTestData.nombreUsuario);
    cy.get('input#correo').type(adminTestData.correo);
    cy.get('input#nombre').type(adminTestData.nombre);
    cy.get('input#apellido').type(adminTestData.apellido);
    cy.get('input#telefono').type(adminTestData.telefono);
    cy.get('input#fotografia').attachFile(adminTestData.fotografia);
    cy.get('select#genero').select(adminTestData.genero);
    cy.get('select#estadoCivil').select(adminTestData.estadoCivil);
    cy.get('select#estado').select(adminTestData.estado);

    // Hacer clic en el botón para registrar
    cy.get('#registrarAdministrador').click();

    // Verificar que se muestra el mensaje de éxito
    cy.get('.alert.alert-success')
      .should('be.visible')
      .and('contain', 'Usuario registrado exitosamente');
  });

  it('Debería mostrar un error si se intenta registrar un administrador con un nombre de usuario duplicado', () => {
    cy.visit('http://localhost:3000/supervisor/registrar-admin');

    // Completar el formulario con los mismos datos para simular un duplicado
    cy.get('input#nombreUsuario').type(adminTestData.nombreUsuario);  // Nombre de usuario duplicado
    cy.get('input#correo').type(adminTestData.correo);  // Correo duplicado
    cy.get('input#nombre').type(adminTestData.nombre);
    cy.get('input#apellido').type(adminTestData.apellido);
    cy.get('input#telefono').type(adminTestData.telefono);
    cy.get('input#fotografia').attachFile(adminTestData.fotografia);
    cy.get('select#genero').select(adminTestData.genero);
    cy.get('select#estadoCivil').select(adminTestData.estadoCivil);
    cy.get('select#estado').select(adminTestData.estado);

    // Hacer clic en el botón para registrar
    cy.get('#registrarAdministrador').click();

    // Verificar que se muestra el error de duplicado de nombre de usuario o correo
    cy.get('.alert.alert-danger')
      .should('be.visible')
      .and('contain', ' Error al registrar usuario: Ya existe un usuario con este correo electrónico');
  });

});
