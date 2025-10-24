export const contactService = {
    validateContactForm(formData) {
      const errors = {};
  
      if (!formData.nombre.trim()) {
        errors.nombre = 'El nombre es requerido';
      }
  
      if (!formData.email.trim()) {
        errors.email = 'El email es requerido';
      } else if (!this.isValidEmail(formData.email)) {
        errors.email = 'El email no es válido';
      }
  
      if (formData.telefono && !this.isValidPhone(formData.telefono)) {
        errors.telefono = 'El teléfono no es válido';
      }
  
      if (!formData.asunto) {
        errors.asunto = 'El asunto es requerido';
      }
  
      if (!formData.mensaje.trim()) {
        errors.mensaje = 'El mensaje es requerido';
      }
  
      return errors;
    },
  
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
  
    isValidPhone(phone) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
      return phoneRegex.test(phone);
    },
  
    async submitContactForm(formData) {
      try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Guardar en localStorage
        const contacts = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
        const newSubmission = {
          ...formData,
          id: Date.now(),
          fecha: new Date().toISOString(),
          estado: 'pendiente'
        };
        
        contacts.push(newSubmission);
        localStorage.setItem('contact_submissions', JSON.stringify(contacts));
        
        return { 
          success: true, 
          message: '¡Gracias por contactarnos! Te responderemos a la brevedad.',
          data: newSubmission
        };
      } catch (error) {
        return { 
          success: false, 
          message: 'Error al enviar el formulario. Por favor, intenta nuevamente.' 
        };
      }
    },
  
    getContactSubmissions() {
      return JSON.parse(localStorage.getItem('contact_submissions') || '[]');
    },
  
    updateSubmissionStatus(submissionId, status) {
      const submissions = this.getContactSubmissions();
      const submission = submissions.find(s => s.id === submissionId);
      
      if (submission) {
        submission.estado = status;
        submission.fechaActualizacion = new Date().toISOString();
        localStorage.setItem('contact_submissions', JSON.stringify(submissions));
        return true;
      }
      
      return false;
    }
  };