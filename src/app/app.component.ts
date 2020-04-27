import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

interface transaction {
  balance: number;
  change: number;
}

class Wager {
  transaction_history: {[name: string]: transaction}[]
  columns: string[]
  
  constructor() {
    this.columns = []
    this.transaction_history = [{}]
  }
  
  addTransaction(cost:number, payer_obj: any [], payees_obj: any []) {
    // validate input
    if (cost <=0 || isNaN(cost) || payer_obj.length==0 || payees_obj.length==0 ) { return }
    
    const payees: string [] = payees_obj.map( e => e._value)
    const payer: string = payer_obj[0]._value
    const part = cost / payees_obj.length
    const last_state = this.transaction_history[0]

    var new_state = {}
    for (var key in last_state) {
      new_state[key] = {balance: last_state[key].balance, change: 0}
    }

    for (var payee of payees) {
      new_state[payee].balance = new_state[payee].balance - part
      new_state[payee].change  = -1 * part
    }
    new_state[payer].balance += cost
    new_state[payer].change  += cost

    this.transaction_history.unshift(new_state)
  }

  addPerson( name:string ){
    if (name=="" || this.columns.includes(name)) { return } // validate input
    this.columns.push(name);
    this.transaction_history.map( (dic) => {dic[name]={balance:0,change:0}; return dic})
  }
}

const wager:Wager = new Wager()

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  names = wager.columns
  transaction_history = wager.transaction_history

  // form input
  payer: string
  payees: string []

  constructor( private route: ActivatedRoute){
    this.route.queryParams.subscribe(params => {
      if(params.ppl == undefined) { return }
      for (let name of params.ppl.split(";") )
      { wager.addPerson(name) }
    })
  }

  ngOnInit(): void {}
  addRow(cost:number, payer:any [], payees_obj: any [], HTMLtable){
    console.log(payer)
    wager.addTransaction(cost,payer,payees_obj)
    HTMLtable.renderRows()  // re-render after adding row
  }
  addColumn(name:string){
    wager.addPerson( name )
  }
  round(n:number){
    return Math.round(n * 10) / 10
  }
}

// TODO: reset transaction after clicking(only who pays maybe)
// TODO: mamke everyone seleced at beginning (or selct all button)
// TODO: change icaon at top