<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if(isset($_FILES['croppedImg'])){
        $file = $_FILES['croppedImg'];
    
        // File properties
        $fileName = $file['name'];
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileError = $file['error'];
    
        // Create directory if it doesn't exist
        $uploadDir = 'uploads/cropped/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true); // Create directory recursively
        }
    
        // Check if file is uploaded without errors
        if($fileError === 0){
            $fileDestination = $uploadDir . $fileName;
            move_uploaded_file($fileTmpName, $fileDestination);
            echo "File uploaded successfully.";
        } else {
            echo "Error uploading file.";
        }
    } if(isset($_FILES['resultImg'])){
        $file = $_FILES['resultImg'];
    
        // File properties
        $fileName = $file['name'];
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileError = $file['error'];
    
        // Create directory if it doesn't exist
        $uploadDir = 'uploads/result/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true); // Create directory recursively
        }
    
        // Check if file is uploaded without errors
        if($fileError === 0){
            $fileDestination = $uploadDir . $fileName;
            move_uploaded_file($fileTmpName, $fileDestination);
            echo "File uploaded successfully.";
        } else {
            echo "Error uploading file.";
        }
    }if(isset($_FILES['userImg'])){
        $file = $_FILES['userImg'];
    
        // File properties
        $fileName = $file['name'];
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileError = $file['error'];
    
        // Create directory if it doesn't exist
        $uploadDir = 'uploads/userImg/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true); // Create directory recursively
        }
    
        // Check if file is uploaded without errors
        if($fileError === 0){
            $fileDestination = $uploadDir . $fileName;
            move_uploaded_file($fileTmpName, $fileDestination);
            echo "File uploaded successfully.";
        } else {
            echo "Error uploading file.";
        }
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo "Only POST requests are allowed.";
}
?>
