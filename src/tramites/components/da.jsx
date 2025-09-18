    const processRowUpdate = async (newRow) => {
      const oldRow = cotizadores.find((row) => row.id === newRow.id);
    
      if (!oldRow) return newRow;
    
      const changedField = Object.keys(newRow).find((key) => oldRow[key] !== newRow[key]);
    
      if (changedField) {
        const newValue = newRow[changedField];
    
        let respuesta = true;
    
        if (changedField === "escribirlink") {
          try {
            respuesta = await handleConfirmar(`Esta seguro que la url es: ${newValue}`);
          } catch (error) {
            respuesta = false; // Manejar el error y establecer respuesta en false
          }
        }
    
        console.log("respuesta", respuesta)
        if (respuesta) {

          setEditingField(changedField);
          setEditingValue(newValue);
          
          let formValues = { [changedField]: newValue, 'id': newRow.id };

          if(changedField === "escribirlink"){
             formValues = { ['linkPago']: newValue, 'id': newRow.id };
          }
          
          dispatch(updateThunks(formValues, 'tramite'));
        }
      }
    
      return oldRow;
    };