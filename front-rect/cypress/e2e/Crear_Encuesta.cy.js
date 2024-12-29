describe('Llenado de encuesta de satisfacción', () => {
  // Caso 1: El botón con el ID correcto existe
  it('Completar la encuesta de satisfacción y enviarla con el botón existente', () => {
    cy.visit('http://localhost:3000/atencion-cliente/encuesta-satisfaccion');

    // Completar el número de cliente
    cy.get('input#numeroCliente').type('1'); 

    // Completar las respuestas de la encuesta
    cy.get('input[name="calidadServicios"][value="5"]').check(); 
    cy.get('input[name="facilidadUso"][value="4"]').check(); 
    cy.get('input[name="rapidezTransacciones"][value="5"]').check();
    cy.get('input[name="seguridadPlataforma"][value="5"]').check(); 
    cy.get('input[name="recomendacion"][value="5"]').check();

    // Hacer clic en el botón de enviar encuesta con un ID correcto que existe
    cy.get('#botonEnviarEncuesta').click();

    // Verificar si el mensaje de éxito aparece
    cy.contains('Encuesta enviada exitosamente.').should('be.visible');
  });

  // Caso 2: El botón con el ID no existe
  it('Debería mostrar un error si el botón con el ID no existe', () => {
    cy.visit('http://localhost:3000/atencion-cliente/encuesta-satisfaccion');

    // Completar el número de cliente
    cy.get('input#numeroCliente').type('10000'); 

    // Completar las respuestas de la encuesta
    cy.get('input[name="calidadServicios"][value="5"]').check(); 
    cy.get('input[name="facilidadUso"][value="4"]').check(); 
    cy.get('input[name="rapidezTransacciones"][value="5"]').check();
    cy.get('input[name="seguridadPlataforma"][value="5"]').check(); 
    cy.get('input[name="recomendacion"][value="5"]').check();

    // Intentar hacer clic en un botón con un ID que NO existe
    cy.get('#botonEnviarEncuesta').click();
    cy.wait(30000);

    cy.contains('Error de conexión al enviar la encuesta.').should('be.visible');
  });
});
