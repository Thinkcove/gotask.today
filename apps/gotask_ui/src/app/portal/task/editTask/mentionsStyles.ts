// mentionsStyles.ts
export const mentionsStyles = {
  control: {
    backgroundColor: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
    minHeight: 80,
    border: '1px solid #ccc',
    borderRadius: 4,
    padding: '5px 10px',
  },
  highlighter: {
    overflow: 'hidden',
  },
  input: {
    margin: 0,
    outline: 'none',
    border: 'none',
    width: '100%',
    fontSize: 14,
    fontFamily: 'inherit',
    minHeight: 80,
  },
  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '1px solid #ccc',
      fontSize: 14,
      maxHeight: 150,
      // Add type assertion here
      overflowY: 'auto' as 'auto' | 'scroll' | 'visible' | 'hidden' | 'clip',
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid #ddd',
      '&focused': {
        backgroundColor: '#741B92',
        color: 'white',
        cursor: 'pointer',
      },
    },
  },
};
