describe('Registro de Quejas', () => {

  it('debería permitir registrar una queja con éxito', () => {

    const apiUrl = 'http://localhost:5000';
    cy.visit('http://localhost:3000/atencion-cliente/registro-quejas'); 

    // Interceptamos la solicitud POST a la API para simular una respuesta de éxito
    cy.intercept('POST', `${apiUrl}/crear_queja`, {
      statusCode: 200, 
      body: {
        mensaje: 'Queja creada exitosamente.', 
      },
    }).as('crearQueja');  

    // Llenamos el formulario con datos válidos
    cy.get('#numeroCuenta').type('123456');  // Número de cuenta del cliente
    cy.get('#detallesQueja').type('La calidad del servicio es deficiente.');  // Detalles de la queja
    cy.get('#tipoQueja').select('Servicio');  // Tipo de queja: 'Servicio'

    // Enviamos el formulario
    cy.get('#btnRegistrarQueja').click();

    // Esperamos a que la solicitud sea interceptada y procesada
    cy.wait('@crearQueja');

    // Verificamos que el mensaje de éxito se muestre correctamente
    cy.get('.alert.alert-success').should('contain', 'Queja creada exitosamente.');

    // Verificamos que los campos del formulario se hayan limpiado después del registro
    cy.get('#numeroCuenta').should('have.value', '');
    cy.get('#detallesQueja').should('have.value', '');
    cy.get('#tipoQueja').should('have.value', '');
  });




  it('debería mostrar un mensaje de error si la queja no se puede registrar', () => {
    const apiUrl = 'http://localhost:5000';
    cy.visit('http://localhost:3000/atencion-cliente/registro-quejas');  

    // Interceptamos la solicitud POST a la API para simular una respuesta de error
    cy.intercept('POST', `${apiUrl}/crear_queja`, {
      statusCode: 400, 
      body: {
        mensaje: 'Error al crear la queja.',
      },
    }).as('crearQuejaError'); 

    // Llenamos el formulario con datos válidos
    cy.get('#numeroCuenta').type('123456');  // Número de cuenta
    cy.get('#detallesQueja').type('La calidad del servicio es deficiente.');  // Detalles de la queja
    cy.get('#tipoQueja').select('Servicio');  // Tipo de queja

    // Enviamos el formulario
    cy.get('#btnRegistrarQueja').click();

    // Esperamos a que la solicitud sea interceptada y procesada
    cy.wait('@crearQuejaError');

    // Verificamos que se muestre un mensaje de error en pantalla
    cy.get('.alert.alert-danger').should('contain', 'Error al crear la queja.');
  });



  
});
