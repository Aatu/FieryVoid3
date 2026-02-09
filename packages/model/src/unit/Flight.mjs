import Ship from "./Ship";

/*
Flight is a combination of multiple ships

Flight will contain multiple ships that will be much simpler than normal ships. 
For example they might have only one engine system that requires no power, produces thrust
and can channel thrust in any direction.

For movement flight will use member with least thrust produced

Flight will never use EW, instead flight has constant defensive and offensive capabilities
*/
class Flight extends Ship {}

export default Flight;
