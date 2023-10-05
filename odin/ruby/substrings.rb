################################################################
# Assignment
################################################################
# Implement a method #substrings that takes a word as the first
# argument and then an array of valid substrings (your dictionary)
# as the second argument. It should return a hash listing each
# substring (case insensitive) that was found in the original
# string and how many times it was found.
dictionary = ["below","down","go","going","horn","how","howdy","it","i",
              "low","own","part","partner","sit"]
# > substrings("below", dictionary )
# => { "below" => 1, "low" => 1 }
# 
# Next, make sure your method can handle multiple words:
# 
# > substrings("Howdy partner, sit down! How's it going?", dictionary)
#  => { "down" => 1, "go" => 1, "going" => 1, "how" => 2, "howdy" => 1,
#       "it" => 2, "i" => 3, "own" => 1, "part" => 1, "partner" => 1,
#       "sit" => 1 }
#
# Quick Tips:
#
#     Recall how to turn strings into arrays and arrays into strings.
################################################################
def get_substrings_set s
  substrings = Set.new
  n = s.length
  (0...n).each do |i|
    (i...n).each do |j|
      substrings.add( s[i..j].downcase )
    end
  end
  substrings
end
################################################################
def substrings s, dict
  tab = Hash.new( 0 )
  s.scan( /\w+/ ).each do |t|
    get_substrings_set( t ).each do |w|
      tab[w] += 1 if dict.include?( w )
    end
  end
  tab
end
###############################################################_
puts substrings( "Howdy partner, sit down! How's it going?", dictionary )
################################################################
