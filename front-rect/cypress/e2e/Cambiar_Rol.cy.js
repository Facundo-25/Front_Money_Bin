describe('Perfil Admin - Cambio de Rol', () => {

  it('Debe cambiar el rol de un usuario a Cajero', () => {
    const apiUrl = 'http://localhost:5000';
    cy.visit('http://localhost:3000/administrador/perfil');

    // Verificamos que la página contiene el título 
    cy.get('h2').contains('Cambiar Rol de Usuario');

    // Simulamos el llenado del formulario 
    cy.get('#nombreUsuario').type('cajero');
    cy.get('#nuevoRol').select('1'); 

    // Actualizamos el rol
    cy.get('#btnActualizarRol').click();

    // Esperamos que el mensaje de éxito aparezca con el contenido esperado
    cy.get('.alert.alert-success')
      .should('be.visible')
      .and('contain', 'Rol actualizado exitosamente.');

    cy.get('.alert.alert-danger').should('not.exist');
  });



  
  it('Debe mostrar un mensaje de error si el rol no se puede actualizar', () => {

    const apiUrl = 'http://localhost:5000';
    cy.visit('http://localhost:3000/administrador/perfil');

    // Verificamos que la página contiene el título 
    cy.get('h2').contains('Cambiar Rol de Usuario');

    // Simulamos el llenado del formulario sin seleccionar un nuevo rol 
    cy.get('#nombreUsuario').type('cajero1');
    cy.get('#nuevoRol').select(''); 

    // Actualizamos el rol
    cy.get('#btnActualizarRol').click();

    // Verificamos que se muestra un mensaje de error si no se completaron todos los campos
    cy.get('.alert.alert-danger')
      .should('be.visible')
      .and('contain', 'Por favor ingresa tanto el nombre de usuario como el nuevo rol.');

    // Verificamos que el mensaje de éxito no se muestre
    cy.get('.alert.alert-success').should('not.exist');
  });

});
