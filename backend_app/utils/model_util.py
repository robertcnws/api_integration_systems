from api_reward_points.models import RewardInvoiceTax, RewardInvoiceLineItem, RewardInvoice

def create_reward_invoice_tax_instance(json_data):
    existing_tax = RewardInvoiceTax.objects.filter(
        tax_name=json_data.get('tax_name', ''),
        tax_amount=json_data.get('tax_amount', 0.0) or 0.0
    ).first() 
    if existing_tax:
        return existing_tax  
    return RewardInvoiceTax(
        tax_name=json_data.get('tax_name', ''),
        tax_amount=json_data.get('tax_amount', 0.0) or 0.0
    ).save()
    

def create_reward_invoice_line_item_instance(json_data):
    existing_line_item = RewardInvoiceLineItem.objects.filter(
        item_id=json_data.get('item_id', ''),
        quantity=json_data.get('quantity', 1) or 1,
        rate=json_data.get('rate', 0.0) or 0.0,
    ).first()
    if existing_line_item:
        return existing_line_item
    return RewardInvoiceLineItem(
        line_item_id=json_data.get('line_item_id', ''),
        item_id=json_data.get('item_id', ''),
        sku=json_data.get('sku', ''),
        name=json_data.get('name', ''),
        description=json_data.get('description', ''),
        rate=json_data.get('rate', 0.0) or 0.0,
        quantity=json_data.get('quantity', 1) or 1,
        item_total=json_data.get('item_total', 0.0) or 0.0
    ).save()
    
def create_reward_invoice_instance(json_data):
    existing_invoice = RewardInvoice.objects.filter(
        invoice_id=json_data.get('invoice_id', ''),
    ).first()
    if existing_invoice:
        return existing_invoice
    return RewardInvoice(
        invoice_id=json_data.get('invoice_id', ''),
        invoice_number=json_data.get('invoice_number', ''),
        date=json_data.get('date', None),
        sub_total=json_data.get('sub_total', 0.0) or 0.0,
        payment_made=json_data.get('payment_made', 0.0) or 0.0,
        taxes=[create_reward_invoice_tax_instance(tax) for tax in json_data.get('taxes', [])],
        line_items=[create_reward_invoice_line_item_instance(item) for item in json_data.get('line_items', [])]
    ).save()