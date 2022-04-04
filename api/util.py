from pony.orm import Required

def render_object(to_render, exceptions=[]):
    fields = [field for field in dir(to_render) if not callable(getattr(to_render, field)) and not field.startswith('_')]
    return { field: str(getattr(to_render, field)) for field in fields if field not in exceptions }

def field_difference(form, model, exceptions=[]):
    return set([element for element in dir(model) if isinstance(getattr(model, element), Required) and not element.startswith('_')]) - set(form.keys()) - set(exceptions)

def confirm_fields(form, model, exceptions=[]):
    return len(field_difference(form, model, exceptions)) == 0
