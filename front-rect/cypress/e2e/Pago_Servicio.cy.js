describe('Pago de Servicios', () => {
    it('Completar el formulario de pago de servicio y enviar', () => {

      cy.visit('http://localhost:3000/cajero/pago-servicios'); 
  
      cy.get('input#nombrePagador').type('Steven Mejia');
      cy.get('select#tipoServicio').select('Luz'); 
      cy.get('input#monto').type('100'); 
  
      cy.get('input#esPagoConCuenta').uncheck(); 
  
      cy.get('button#submitPago').click(); 
  
      cy.contains('Pago realizado con éxito').should('be.visible'); 
    });
  });
  