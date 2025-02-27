document.getElementById('messageForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
    };


    try {

        const response = await fetch('http://localhost:3000/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result) {
            alert('Email sent suceessfully!.');
        }
    } catch (error) {
        alert('Failed to send you email!.');
        console.log(error)
    }
});
