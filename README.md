# Zentrix

A chat app with message encryption.
Built with Preact and CapacitorJS


Messages are only decrypted on the client side in memory.

client/ 
	- Preact Frontend
server/
	- Express & MongoDB Backend
	

# Moved away from Firebase
Why? Firebase was horrible for security. Their rules dictated how your database was structured.. which was horrible. 
I needed way more control over data validation. I will probably never be using Firebase again. The only benefit I will say
is the auth was very quick and easy.
