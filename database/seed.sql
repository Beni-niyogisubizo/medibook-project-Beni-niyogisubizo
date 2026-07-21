USE medibook;

INSERT INTO patients (full_name, email, phone)
VALUES
    ('Alice Johnson', 'alice@example.com', '+250788111111'),
    ('Brian Smith', 'brian@example.com', '+250788222222'),
    ('Caroline Brown', 'caroline@example.com', '+250788333333');

INSERT INTO doctors (
    full_name,
    specialty,
    consultation_fee,
    room_number
)
VALUES
    ('Dr. David Wilson', 'Cardiology', 100.00, 'A101'),
    ('Dr. Emma Taylor', 'Dermatology', 80.00, 'B202'),
    ('Dr. Frank Miller', 'General Medicine', 60.00, 'C303');
