########################################################
$MOD = 26
########################################################
def decode char, shift
  if char >= 'a' and char <= 'z'
    base = 'a'.ord
  elsif char >= 'A' and char <= 'Z'
    base = 'A'.ord
  else
    return char
  end
  off = ( char.ord - base ) + shift
  ( base + off % $MOD ).chr
end
#######################################################_
def caesar_cipher msg, shift
  cipher = ""
  msg.each_char do |char|
    cipher << decode( char, shift )
  end
  cipher
end
########################################################
puts caesar_cipher( "What a string!", 5 )
########################################################
